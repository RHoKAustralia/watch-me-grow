import {
    createPool,
  } from 'slonik';
  
  const pool = createPool(`postgres://${process.env.POSTGRES_URI}`);
  
  export default pool;