import boto3
from decimal import Decimal
import json
import sys
import time
import urllib.request
import urllib.parse
import urllib.error

table='sdkDynamoDBStack-sdkVideoLabels'

print('Loading function ImageRekognitionMarkFour')
rekognition = boto3.client('rekognition')

# SNS ARN:
# SQS ARN: 

def detect_labels_image(bucket, key):
    try: 
        print("Starting Rekognition")
        response = rekognition.detect_labels(Image={"S3Object": {"Bucket": bucket, "Name": key}})
        
        print("Rekognition results:")
        print(response)
    
        table = boto3.resource('dynamodb').Table(table)
        #labels = [{'Confidence': Decimal(str(label_prediction['Confidence'])), 'Name': label_prediction['Name']} for label_prediction in response['Labels']]
        labels = [{'Confidence': Decimal(str(label_prediction['Confidence'])), 'Name': label_prediction['Name']} for label_prediction in response['ModerationLabels']]

        table.put_item(Item={'video_id': key, 'Labels': labels})
        return response
    except Exception as e:
         print(e)
         print("Error processing object {} from bucket {}. ".format(key, bucket))
         raise e

class VideoDetect:
    jobId = ''
    rek = boto3.client('rekognition')
    sqs = boto3.client('sqs')
    sns = boto3.client('sns')
    
    roleArn = ''
    bucket = ''
    video = ''
    startJobId = ''

    sqsQueueUrl = ''
    snsTopicArn = ''
    processType = ''

    def __init__(self, role, bucket, video):    
        self.roleArn = role
        self.bucket = bucket
        self.video = video

    def GetSQSMessageSuccess(self):

        jobFound = False
        succeeded = False
    
        dotLine=0
        while jobFound == False:
            sqsResponse = self.sqs.receive_message(QueueUrl=self.sqsQueueUrl, MessageAttributeNames=['ALL'],
                                          MaxNumberOfMessages=10)

            if sqsResponse:
                
                if 'Messages' not in sqsResponse:
                    if dotLine<5: # Was 40
                        #print('.', end='')
                        dotLine=dotLine+1
                    else:
                        print('"Messages" not found in sqsResponse:')
                        print(sqsResponse)
                        dotLine=0    
                    sys.stdout.flush()
                    time.sleep(5)
                    continue

                print('Success Message found')
                print(sqsResponse)
                for message in sqsResponse['Messages']:
                    notification = json.loads(message['Body'])
                    rekMessage = json.loads(notification['Message'])
                    print(rekMessage['JobId'])
                    print(rekMessage['Status'])
                    if rekMessage['JobId'] == self.startJobId:
                        print('Matching Job Found:' + rekMessage['JobId'])
                        jobFound = True
                        if (rekMessage['Status']=='SUCCEEDED'):
                            succeeded=True

                        self.sqs.delete_message(QueueUrl=self.sqsQueueUrl,
                                       ReceiptHandle=message['ReceiptHandle'])
                    else:
                        print("Job didn't match:" +
                              str(rekMessage['JobId']) + ' : ' + self.startJobId)
                    # Delete the unknown message. Consider sending to dead letter queue
                    self.sqs.delete_message(QueueUrl=self.sqsQueueUrl,
                                   ReceiptHandle=message['ReceiptHandle'])


        return succeeded

    def StartLabelDetection(self):
        response=self.rek.start_content_moderation(Video={'S3Object': {'Bucket': self.bucket, 'Name': self.video}},
            NotificationChannel={'RoleArn': self.roleArn, 'SNSTopicArn': self.snsTopicArn})

        self.startJobId=response['JobId']
        print('Start Job Id: ' + self.startJobId)
        print('Start Job Response:')
        print(response)


    def GetLabelDetectionResults(self):
        maxResults = 10
        paginationToken = ''
        finished = False

        while finished == False:
            #response = self.rek.get_label_detection(JobId=self.startJobId,
            response = self.rek.get_content_moderation(JobId=self.startJobId,
                                            MaxResults=maxResults,
                                            NextToken=paginationToken,
                                            SortBy='TIMESTAMP')
            
            print('Finished Detection response:')
            print(response)

            print('Codec: ' + response['VideoMetadata']['Codec'])
            print('Duration: ' + str(response['VideoMetadata']['DurationMillis']))
            print('Format: ' + response['VideoMetadata']['Format'])
            print('Frame rate: ' + str(response['VideoMetadata']['FrameRate']))
            print("All ModerationLabels: " + str(response['ModerationLabels']))

            # Save label results and confidence level in DynamoDB
            table = boto3.resource('dynamodb').Table(table)
            #labels = [{'Confidence': Decimal(str(label_prediction['Label']['Confidence'])), 'Name': label_prediction['Label']['Name']} for label_prediction in response['Labels']]
            labels = [{'Confidence': Decimal(str(label_prediction['ModerationLabel']['Confidence'])), 'Name': label_prediction['ModerationLabel']['Name']} for label_prediction in response['ModerationLabels']]
            print("All Labels: ")
            print(labels)
            table.put_item(Item={'video_id': self.video, 'Labels': labels})
            
            print()

            # Print confidence results to log
            #for labelDetection in response['Labels']:
                #label=labelDetection['Label']

                #print("Timestamp: " + str(labelDetection['Timestamp']))
                #print("   Label: " + label['Name'])
                #print("   Confidence: " +  str(label['Confidence']))
                #print("   Instances:")
                #for instance in label['Instances']:
                    #print ("      Confidence: " + str(instance['Confidence']))
                    #print ("      Bounding box")
                    #print ("        Top: " + str(instance['BoundingBox']['Top']))
                    #print ("        Left: " + str(instance['BoundingBox']['Left']))
                    #print ("        Width: " +  str(instance['BoundingBox']['Width']))
                    #print ("        Height: " +  str(instance['BoundingBox']['Height']))
                    #print()
                #print()
                #print ("   Parents:")
                #for parent in label['Parents']:
                #    print ("      " + parent['Name'])
                #print ()

            if 'NextToken' in response:
                paginationToken = response['NextToken']
            else:
                return response
                finished = True
    
    def CreateTopicandQueue(self):
      
        millis = str(int(round(time.time() * 1000)))

        #Create SNS topic
        
        snsTopicName="AmazonRekognitionExample" + millis

        topicResponse=self.sns.create_topic(Name=snsTopicName)
        self.snsTopicArn = topicResponse['TopicArn']
        
        print("SNS creation response:")
        print(topicResponse)

        #create SQS queue
        sqsQueueName="AmazonRekognitionQueue" + millis
        self.sqs.create_queue(QueueName=sqsQueueName)
        self.sqsQueueUrl = self.sqs.get_queue_url(QueueName=sqsQueueName)['QueueUrl']
 
        attribs = self.sqs.get_queue_attributes(QueueUrl=self.sqsQueueUrl,
                                                    AttributeNames=['QueueArn'])['Attributes']
                                        
        sqsQueueArn = attribs['QueueArn']

        # Subscribe SQS queue to SNS topic
        self.sns.subscribe(
            TopicArn=self.snsTopicArn,
            Protocol='sqs',
            Endpoint=sqsQueueArn)

        #Authorize SNS to write SQS queue 
        policy = """{{
  "Version":"2012-10-17",
  "Statement":[
    {{
      "Sid":"MyPolicy",
      "Effect":"Allow",
      "Principal" : {{"AWS" : "*"}},
      "Action":"SQS:SendMessage",
      "Resource": "{}",
      "Condition":{{
        "ArnEquals":{{
          "aws:SourceArn": "{}"
        }}
      }}
    }}
  ]
}}""".format(sqsQueueArn, self.snsTopicArn)
 
        response = self.sqs.set_queue_attributes(
            QueueUrl = self.sqsQueueUrl,
            Attributes = {
                'Policy' : policy
            })
        
        print("SNS creation response:")
        print(response)

    def DeleteTopicandQueue(self):
        self.sqs.delete_queue(QueueUrl=self.sqsQueueUrl)
        self.sns.delete_topic(TopicArn=self.snsTopicArn)

def lambda_handler(event, context):
    '''Demonstrates S3 trigger that uses Rekognition APIs to detect labels in S3 Object.'''
    #print("Received event: " + json.dumps(event, indent=2))
    
    print("Rekognition lambda triggered.")
    print(event)
    print(context)
    
    analyzer = ''
    response = ''
    roleArn = ''
    
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    video = event['Records'][0]['s3']['object']['key']

    try:
        analyzer=VideoDetect(roleArn, bucket, video)
    except Exception as e:
        print(e)
        print("Could not create class VideoDetect.")
        raise e
    
    try:
        analyzer.CreateTopicandQueue()
    except Exception as e:
        print(e)
        print("Could not create Topic and Queue.")
        analyzer.DeleteTopicandQueue()
        raise e
    
    try:
        analyzer.StartLabelDetection()
    except Exception as e:
        print(e)
        print("Could not start Video processing.")
        analyzer.DeleteTopicandQueue()
        raise e
        
    try:
        if analyzer.GetSQSMessageSuccess()==True:
            response = analyzer.GetLabelDetectionResults()
        
        analyzer.DeleteTopicandQueue()
        print(response)
        return response
    except Exception as e:
        print(e)
        print("Error processing video {} from bucket {}. ".format(video, bucket) +
              "Make sure your video and bucket exist and your bucket is in the same region as this function.")
        analyzer.DeleteTopicandQueue()
        raise e
