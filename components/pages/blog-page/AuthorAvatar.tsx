import Link from 'next/link';
import Image from 'next/image';


export default function AuthorAvatar({ post }: { post: Post }) {
  return (
    <Link href={`/author/${post.metadata.author?.slug}`}>
      <Image
        className="h-8 w-8 rounded-full"
        src={`${post.metadata.author?.metadata.image?.imgix_url}?w=100&auto=format,compression`}
        alt={post.title}
      />
    </Link>
  );
}