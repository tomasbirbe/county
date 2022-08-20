export default function orderByDate(array: any[]) {
return  array.sort((a, b) => {
    if (new Date(a.date) >= new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}
