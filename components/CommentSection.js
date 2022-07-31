import { useRouter } from 'next/router';
import { useState } from 'react';
import Star from '../public/star-empty.svg';
import { useForm } from 'react-hook-form';
import Comment from './ui/Comment';

export default function CommentSection({ comments }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
      title: '',
    },
  });

  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [commentsState, setComments] = useState(comments);

  function handleClick(value) {
    if (rating === value) {
      setRating(0);
    } else {
      setRating(value);
    }
  }

  async function onSubmit({ comment, title }) {
    const data = { title, comment, rating };
    reset();
    setRating(0);
    setComments([...commentsState, { ...data, comment_rating: 0 }]);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, path: router.asPath, user: 'default' }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="px-4 md:px-36 md:pt-12 pb-32">
      <h2 className="text-5xl pb-10 pt-16 font-bold">Comments</h2>
      <div className="grid grid-cols-2 gap-x-6">
        <div className="col-span-1">
          {/* CARD */}
          {commentsState.map((comment) => (
            <Comment comment={comment} key={comment._id} />
          ))}
        </div>
        <div className="col-span-1">
          <form
            action="submit"
            className="bg-dark-card shadow-8 rounded-4xl p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-white-high text-4xl font-bold pb-8">How was it ?</h3>
            <input
              {...register('title', { required: 'Please fill in this field' })}
              type="text"
              placeholder="Title..."
              className="w-full"
            />
            <p className="pl-2 text-red-500 mt-2 text-sm">{errors.title?.comment}</p>
            <textarea
              {...register('comment', { required: 'Please fill in this field' })}
              className="mt-8"
              name="comment"
              placeholder="Comment"
              id=""
              cols="30"
              rows="7"
            />
            <p className="pl-2 text-red-500 mt-1 text-sm">{errors.comment?.comment}</p>
            <p className=" text-xl mb-2 mt-8">Rating</p>
            <div className="flex justify-between">
              <div className="star-container cursor-pointer flex flex-row-reverse bg-[#474747] rounded-2xl px-4 py-2 items-center shadow-8">
                <Star
                  onClick={() => {
                    handleClick(5);
                  }}
                  className={rating > 4 ? 'filled' : ''}
                />
                <Star
                  onClick={() => {
                    handleClick(4);
                  }}
                  className={rating > 3 ? 'filled' : ''}
                />
                <Star
                  onClick={() => {
                    handleClick(3);
                  }}
                  className={rating > 2 ? 'filled' : ''}
                />
                <Star
                  onClick={() => {
                    handleClick(2);
                  }}
                  className={rating > 1 ? 'filled' : ''}
                />
                <Star
                  onClick={() => {
                    handleClick(1);
                  }}
                  className={rating > 0 ? 'filled' : ''}
                />
              </div>
              <button className="button" type="submit">
                SEND
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}