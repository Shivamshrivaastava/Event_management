import dayjs from 'dayjs'

export const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return dayjs(dateStr).format('DD MMM YYYY, hh:mm A')
}
