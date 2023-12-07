import faker from 'faker';
// utils

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Explicit Nudity',
  'Nudity',
  'Graphic Male Nudity',
  'Graphic Female Nudity',
  'Sexual Activity',
  'Illustrated Explicit Nudity',
  'Adult Toys',
  'Suggestive',
  'Female Swimwear Or Underwear',
  'Male Swimwear Or Underwear',
  'Partial Nudity',
  'Barechested Male',
  'Revealing Clothes',
  'Sexual Situations',
  'Violence',
  'Graphic Violence Or Gore',
  'Physical Violence',
  'Weapon Violence',
  'Weapons',
  'Self Injury',
  'Visually Disturbing',
  'Emaciated Bodies',
  'Corpses',
  'Hanging',
  'Air Crash',
  'Explosions And Blasts',
  'Rude Gestures',
  'Middle Finger',
  'Drugs',
  'Drug Products',
  'Drug Use',
  'Pills',
  'Drug Paraphernalia',
  'Tobacco',
  'Tobacco Products',
  'Smoking',
  'Alcohol',
  'Drinking',
  'Alcoholic Beverages',
  'Gambling',
  'Hate Symbols',
  'Nazi Party',
  'White Supremacy',
  'Extremist'
];
// ----------------------------------------------------------------------

const products = [...Array(44)].map((_, index) => {
  // eslint-disable-next-line
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    name: PRODUCT_NAME[index],
    confidence: faker.datatype.number({ min: 60, max: 99, precision: 0.01 }),
    timestamp: faker.datatype.number({ min: 0, max: 9999, precision: 1 })
  };
});

export default products;
