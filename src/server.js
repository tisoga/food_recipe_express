import express from 'express';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express()
const port = 8080

app.use( express.json() )

app.use('/api/v1', foodRouter)

app.use('/api/v1/auth', userRouter)

app.listen(port,
    () => console.log(`Server Running on http://localhost:${port}`)
)