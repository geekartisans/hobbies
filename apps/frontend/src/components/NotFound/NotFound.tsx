import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6">
      <div className="w-full rounded-lg p-8 text-center sm:p-12">
        <div className="mx-auto inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800">
          404 error
        </div>
        <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-pretty text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
