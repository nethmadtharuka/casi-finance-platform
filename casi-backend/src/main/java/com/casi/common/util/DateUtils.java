package com.casi.common.util;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Shared month-boundary helpers used by both Expense and Budget modules (Part 8).
 * Kept here rather than duplicated in each module, per Part 8's "utilities" guidance.
 */
public final class DateUtils {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    private DateUtils() {
    }

    /**
     * Parses a "YYYY-MM" query param into a YearMonth.
     * Defaults to the current month when the input is null/blank (Part 11: "month (defaults to current)").
     */
    public static YearMonth parseMonthOrCurrent(String monthParam) {
        if (monthParam == null || monthParam.isBlank()) {
            return YearMonth.now();
        }
        try {
            return YearMonth.parse(monthParam, MONTH_FORMAT);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid month format, expected YYYY-MM: " + monthParam);
        }
    }

    /** First-of-month convention used for the budgets.month column (Part 10). */
    public static LocalDate firstOfMonth(YearMonth yearMonth) {
        return yearMonth.atDay(1);
    }

    public static LocalDate startOfMonth(YearMonth yearMonth) {
        return yearMonth.atDay(1);
    }

    public static LocalDate endOfMonth(YearMonth yearMonth) {
        return yearMonth.atEndOfMonth();
    }
}
