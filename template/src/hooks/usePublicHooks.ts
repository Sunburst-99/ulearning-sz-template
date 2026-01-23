import { dateFormat } from '@/utils/functions';

export default function() {

  /**
   * 时间格式化
   * @param time
   */
  const formatTime = (time?: number, format?: string) => {
    return time ? dateFormat(time, format ?? 'YYYY-MM-DD HH:mm:ss') : '--'
  }

  return {
    formatTime,
  }
}