import Skeleton from 'react-loading-skeleton'

interface DeckListSkeletonProps {
  showCreateButton?: boolean
  count?: number
}

export function DeckListSkeleton({
  showCreateButton = false,
  count = 3,
}: DeckListSkeletonProps) {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {showCreateButton && (
          <Skeleton
            width={170}
            height={38}
            borderRadius={8}
            containerClassName="order-first md:order-3"
          />
        )}
        <Skeleton
          height={38}
          borderRadius={8}
          containerClassName="flex-1 md:order-1"
        />
        <Skeleton
          width={38}
          height={38}
          borderRadius={8}
          containerClassName="md:order-2"
        />
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
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
