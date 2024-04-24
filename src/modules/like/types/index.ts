import { ApiSchema } from '~/swagger/api-schema.decorator';
import { Like } from '../schemas';

@ApiSchema({ name: 'Like' })
export class LikeResponse extends Like {}
