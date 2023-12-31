import 'dotenv/config';
import 'module-alias/register';

import App from './app';
import MovieRouter from 'resources/movie/movie.router';
import CollectionRouter from 'resources/collection/collection.router';
import validateEnv from 'utils/validateEnv';
import UserRouter from 'resources/user/user.router';

validateEnv(); // validates env variables

const app = new App(
  [new UserRouter(), new MovieRouter(), new CollectionRouter()],
  Number(process.env.PORT)
);

app.listen();
