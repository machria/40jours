
import { juzData } from './juzList';

export interface JuzInfo {
    id: number;
    startPage: number;
    endPage: number;
    start: { surah: number; ayah: number };
    end: { surah: number; ayah: number };
}

export function getAllJuz(): JuzInfo[] {
    return juzData;
}

export function getJuz(id: number): JuzInfo | undefined {
    return juzData.find(j => j.id === id);
}

export function getJuzByPage(page: number): JuzInfo | undefined {
    return juzData.find(j => page >= j.startPage && page <= j.endPage);
}
