import morgan from 'morgan';
import { requestLogStream } from '../utils/logger';

export const requestLogger = morgan(
  (tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const remoteAddress = tokens['remote-addr'](req, res);
    const userAgent = tokens['user-agent'](req, res) || 'unknown';

    return `Incoming request ${method} ${url} from ${remoteAddress} - user-agent="${userAgent}"`;
  },
  {
    immediate: true,
    stream: requestLogStream,
  }
);
