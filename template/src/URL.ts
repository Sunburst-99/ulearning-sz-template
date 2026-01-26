const images = import.meta.glob("@/assets/images/**/*", {
  eager: true,
  import: "default",
});

export function getImageUrl(path: string) {
  console.log(`/src/assets/images/${path}`)
  return images[`/src/assets/images/${path}`] as string;
}
