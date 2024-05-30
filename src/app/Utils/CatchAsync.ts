//For programming error

import { Request, Response, NextFunction } from 'express'; 

interface CustomResponse extends Response {
  translate: (key: string, ...args: any[]) => string;
}

const CatchAsync = (fn: (req: Request, res: CustomResponse, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res as CustomResponse, next).catch(next);
  };
};

export default CatchAsync;
