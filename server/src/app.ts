import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import helmet from 'helmet';
import { errorHander, NotFound } from './middlewares/errorHandler';

// Router
import authRouter from './routes/auth';
import postRouter from './routes/post';
import userRouter from './routes/user';

const app = express();

if (process.env.NODE_ENV === 'production') {
	app.use(morgan('combined'));
	app.use(hpp());
	app.use(helmet());
	app.use(cors({ origin: ['https://typestagram.site'] }));
} else {
	app.use(morgan('dev'));
	app.use(cors({ origin: ['http://localhost:3000'] }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.use(NotFound);
app.use(errorHander);

export default app;
