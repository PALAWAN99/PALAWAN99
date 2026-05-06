'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const config: Record<string, string> = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    return { success: true, config };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveSettings(data: Record<string, string>) {
  try {
    const operations = Object.entries(data).map(([key, value]) => 
      prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    
    await Promise.all(operations);
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
