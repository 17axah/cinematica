import { ApiSchema } from '~/swagger/api-schema.decorator';
import { Genre } from '../schemas';

@ApiSchema({ name: 'Genre' })
export class GenreResponse extends Genre {}
