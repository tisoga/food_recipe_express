import pg from 'pg';
import { DB_CONFIG } from '../config/index.js';

const { Pool } = pg

const pool = new Pool(DB_CONFIG)

export default pool