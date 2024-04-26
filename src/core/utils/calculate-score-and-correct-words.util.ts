// 메타 인지 검사 점수 계산
export const calculateScoreAndCorrectWords = (data: any) => {
  const { total_words, expected_count, input_words } = data;

  const correctWords = total_words.filter((word) => input_words.includes(word));
  const correctCount = correctWords.length;

  const score =
    Number(
      (
        1 -
        Math.abs(correctCount - expected_count) /
          Math.max(correctCount, expected_count)
      ).toFixed(1),
    ) *
      100 +
    (correctCount === expected_count
      ? bonusForSameNumberBetweenGuessAndCorrectNumbers(
          total_words,
          correctCount,
        )
      : 0);

  return {
    score,
    correct_words: correctWords,
  };
};

//NOTE 예측 숫자와 실제 맞춘 숫자가 동일한 경우, 많이 맞춘 경우에 차등을 두기 위한 보너스 점수
const bonusForSameNumberBetweenGuessAndCorrectNumbers = (
  wordsTotal: number,
  correctNumber: number,
) => {
  return 0.3 * wordsTotal * correctNumber;
};
