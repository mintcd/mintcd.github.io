import Link from 'next/link';
import ArrowLeft from '@components/nuclears/icons/ArrowLeft';
import SuggestedPostCard from './SuggestedPostCard';
import Tag from './Tag';
import AuthorAvatar from './AuthorAvatar';
import AuthorAttribution from './AuthorAttribution';
import Image from 'next/image';

export default function SinglePost() {
  const post: Post = {
    id: '1',
    slug: 'slug',
    title: 'Exploring the Wonders of Planet Earth',
    metadata: {
      published_date: '2024-10-08T12:45:00Z',
      content: 'content',
      teaser: 'teaser',
      categories: [{
        title: 'category'
      }]
    }
  }
  return (
    <>

      <Image
        width={1400}
        height={720}
        className="mb-5 h-[720px] w-full bg-no-repeat object-cover object-center"
        src={`https://imgix.cosmicjs.com/baff2ae0-ff1e-11ed-8fca-9b0db64c9b86-greg-rakozy-oMpAz-DN-9I-unsplash.jpg?w=1400&auto=format,compression`}
        alt={post.title}
      />

      <main className="mx-auto flex flex-col justify-center">
        <div className="mx-auto flex w-full flex-col items-start justify-center px-4 md:flex-row">
          <div className="mt-4 flex justify-start pb-4 md:justify-center md:pb-0 md:pr-20">
            <Link
              href="/"
              className="rounded-full border border-zinc-100 bg-white p-2 text-zinc-700 shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="mr-20 flex w-full max-w-3xl flex-col justify-start md:w-3/4">
            <h2>
              {!post && <div className="text-center">Post Not found</div>}
              {post && <Link href={`/posts/${post.slug}`}>{post.title}</Link>}
            </h2>
            {post && (
              <>
                <div className="flex flex-col justify-between space-y-4 pb-8 md:flex-row md:space-y-0">
                  <div className="flex items-center space-x-2 text-zinc-500 md:space-y-0 dark:text-zinc-400">
                    {/* <AuthorAvatar post={post} /> */}
                    <AuthorAttribution post={post} />
                  </div>
                  <div className="flex select-none justify-start space-x-2 md:justify-end">
                    {post.metadata.categories &&
                      post.metadata.categories.map((category) => (
                        <Tag key={category.title}>{category.title}</Tag>
                      ))}
                  </div>
                </div>
                <hr className="w-full border-t border-zinc-300 pb-8 dark:border-zinc-700" />
                <div>
                  {post.metadata.content}
                </div>
              </>
            )}
            <div className="mx-auto mt-8 w-full">
              <hr className="w-full border-t border-zinc-300 pb-8 dark:border-zinc-700" />
              {/* {suggestedPosts && (
                <div className="flex w-full flex-col">
                  <h3 className="pb-3 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                    Suggested Posts
                  </h3>
                  <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    {suggestedPosts
                      // .filter((nextPost) => nextPost?.id !== post?.id)
                      .slice(0, 2)
                      .map((post) => {
                        return <SuggestedPostCard key={post.id} post={post} />;
                      })}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export const revalidate = 60;