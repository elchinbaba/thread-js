const generateRandom6DigitNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export { generateRandom6DigitNumber };
