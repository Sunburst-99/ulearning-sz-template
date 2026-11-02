const images = import.meta.glob("@/assets/images/**/*", {
  eager: true,
  import: "default",
});

export function getImageUrl(path: string) {
  return images[`/src/assets/images/${path}`] as string;
}
