// Adjectives array
const adjectives = [
  'Big',
  'Small',
  'Short',
  'Tall',
  'Tiny',
  'High',
  'Low',
  'Close',
  'Far',
  'Thick',
  'Thin',
  'Thick',
  'Deep',
  'Shallow',
  'Cold',
  'Warm',
  'Hot',
  'Cool',
  'Rough',
  'Soft',
  'Sweet',
  'Thrilling',
  'Fresh',
  'Pure',
  'Plain',
  'Dry',
  'Moist',
  'Clear',
  'Cloudy',
  'Bright',
  'Dark',
  'Different',
  'Strange',
  'Common',
  'Special',
  'Mysterious',
  'Familiar',
  'Known',
  'New',
];

// Nouns array
const nouns = [
  'Lion',
  'Tiger',
  'Apple',
  'Banana',
  'Hamburger',
  'Pizza',
  'Cat',
  'Dog',
  'Rabbit',
  'Computer',
  'Keyboard',
  'Mouse',
  'Laptop',
  'Phone',
  'Bicycle',
  'Car',
  'Airplane',
  'Gift',
  'Flower',
  'Book',
  'Bag',
  'Shoe',
  'Hat',
  'Socks',
  'Cake',
  'Umbrella',
  'Star',
  'Moon',
  'Sun',
  'Sea',
  'Sky',
  'Mountain',
  'River',
  'Puppy',
  'Kitten',
  'Coffee',
  'Tea',
  'Milk',
  'Water',
  'Air',
];

export const generateRandomNickName = () => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  const randomNumber = Math.floor(100 + Math.random() * 900);

  return randomAdjective + randomNoun + randomNumber;
};
