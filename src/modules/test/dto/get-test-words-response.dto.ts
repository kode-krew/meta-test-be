import { ApiProperty } from '@nestjs/swagger';

export class GetTestWordsResponseDto {

    @ApiProperty({example: ["애플", "메타", "테슬라", "구글", "마이크로소프트"], description: 'test words'})
    words: string[];
};
