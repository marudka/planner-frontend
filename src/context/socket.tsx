import { createContext } from 'react';
import io  from 'socket.io-client';
import { BASE_URL } from '../constants/config';

const DEFAULT = {};
export const socket = io.connect(BASE_URL);
export const SocketContext = createContext(DEFAULT);
// @ts-disable