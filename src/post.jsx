//npm install date-fns
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({_id, title, summary, cover, content, createdAt, author, category}) {
  // Function to limit text to a certain number of characters
  const limitTextCharacters = (text, maxCharacters) => {
    if (text.length <= maxCharacters) {
      return text;
    }
    const limitedText = text.substring(0, maxCharacters);
    return `${limitedText} ...`;
  };

  return (
    <div className="post">
      <div className="image">
      <Link to={`/post/${_id}`}>
          <img src={`http://localhost:5000/${cover}`} alt="" style={{ height: '13rem', width: '100%' }} />
        </Link>
      </div>
      <div className="content">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="" className="author">{author.username}</a>
          <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
          {category && <div className="category">{category}</div>}
        </p>
        <p className="summary">{limitTextCharacters(summary, 166)}</p>
      </div>
    </div>
  );
}
