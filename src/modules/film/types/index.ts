import { ApiSchema } from '~/swagger/api-schema.decorator';
import { Film } from '../schemas';

@ApiSchema({ name: 'Film' })
export class FilmResponse extends Film {}
