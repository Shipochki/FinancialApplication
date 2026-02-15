namespace FinancialApplication.Domain.Common
{
    public static class DataConstants
    {
        public static class Account 
        {
            public const int MinLengthName = 3;
            public const int MaxLengthName = 50;

            public const int MaxLengthDescription = 200;

            public const int MinRangeCurrency = 0;
            public const int MaxRangeCurrency = 5;
        }

        public static class Budget
        {
            public const int MinLengthName = 3;
            public const int MaxLengthName = 50;

            public const int MaxLengthDescription = 200;

            public const int MinRangeType = 0;
            public const int MaxRangeType = 6;
        }

        public static class Category
        {
            public const int MinLengthName = 3;
            public const int MaxLengthName = 50;

            public const int MaxLengthDescription = 200;
        }

        public static class Transaction
        {
            public const int MinRangeType = 0;
            public const int MaxRangeType = 1;

            public const int MaxLengthDescription = 200;
        }

        public static class User
        {
            public const int MinLengthName = 1;
            public const int MaxLengthName = 50;

            public const int MinLengthEmail = 3;
            public const int MaxLengthEmail = 254;
        }
    }
}
