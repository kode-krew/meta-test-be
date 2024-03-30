// 메타 인지 검사 점수 계산
export function  calculateScoreAndCorrectWords(data: any) {
    const correctWords = data.total_words.filter(word => data.input_words.includes(word));
    const correctCount = correctWords.length;
    const score = correctCount * 10 - (Math.abs(data.expected_count - correctCount) * 15);
    return {
        score,
        correct_words: correctWords
    };;
};
