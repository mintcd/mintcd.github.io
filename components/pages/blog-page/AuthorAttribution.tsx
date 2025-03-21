import helpers from './utils/helpers';

export default function AuthorAttribution({
  post,
}: {
  post: Post;
}) {
  return (
    <div className="flex space-x-1">
      <span>
        {helpers.stringToFriendlyDate(post.metadata.published_date)}
      </span>
    </div>
  );
}