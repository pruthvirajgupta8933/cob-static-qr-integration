import { APP_ENV } from "./config";
//prod || stage
const keyConfig = {
    LOGIN_AUTH_KEY: APP_ENV ? 'JUtMpbgS8tjzGwDwbyQPIrGXe+9/YTOmrVpr5WmzFBg=' : '2k4Tj2NNnr98/vgJkQNKlPDvDvp3WlOyEMw59EnWweQ=',
    LOGIN_AUTH_IV: APP_ENV ? 'ILeUg1bJPLa5fQ5DtB+VfwS28F+5Ee4tw+iDFMbvZwa7wDkR/u/G/oj1sRpb70kq' : '4w9FC+U1JNF3yyHEu6zNlWjnWEeZhMV8EKyCCNeT9rSE2W5kaxO35h/mnWfGut8X',
}

export default keyConfig