export const makeFakeResponse = ({ totalCount = 0 }) => (
    {
        total_count: totalCount,
        items: []
    }
)
