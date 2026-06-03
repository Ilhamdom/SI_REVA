import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { sql } from 'drizzle-orm';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Fetch counts using raw SQL for efficiency or Drizzle count helper
    const ssCount = await db.select({ count: sql<number>`count(*)` }).from(sasaranStrategis);
    const spCount = await db.select({ count: sql<number>`count(*)` }).from(sasaranProgram);
    const skCount = await db.select({ count: sql<number>`count(*)` }).from(sasaranKegiatan);

    return {
      ss: Number(ssCount[0]?.count || 0),
      sp: Number(spCount[0]?.count || 0),
      sk: Number(skCount[0]?.count || 0),
      capaian: 84.5 // Demo value until we have reporting table
    };
  } catch (error: any) {
    console.error('Dashboard Stats API Error:', error);
    return {
      ss: 0,
      sp: 0,
      sk: 0,
      capaian: 0
    };
  }
});
