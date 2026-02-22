import Skeleton from 'react-loading-skeleton'

export default function YourDecksLoading() {
  return (
    <>
      <div className="flex items-center gap-3">
        <Skeleton containerClassName="flex-1" height={38} borderRadius={8} />
        <Skeleton width={170} height={38} borderRadius={8} />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-button border-border dark:border-border-dark flex items-center justify-between border p-4"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton width="33%" height={20} />
              <Skeleton width="66%" height={16} />
            </div>
            <Skeleton
              width={36}
              height={36}
              borderRadius={8}
              className="ml-4 shrink-0"
            />
          </div>
        ))}
      </div>
    </>
  )
}
