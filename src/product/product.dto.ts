import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @IsNotBlank({ message: 'Product cannot be blank' })
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2000, { message: 'Product have to be greater than 2000 COP' })
  price?: number;
}
