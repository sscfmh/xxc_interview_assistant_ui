import clsx from "clsx";

import React from "react";

/**
 * 计算指定年月的天数
 * @param {number} year - 年份（如 2024）
 * @param {number} month - 月份（1-12，注意：这里是自然月，非 Date 对象的 0 基月份）
 * @returns {number} 该月的天数
 */
function getDaysInMonth(year, month) {
  // 月份参数转为 0 基（因为 Date 中月份是 0-11）
  // 例如：计算 2024年2月，就传入 month=2，转为 1，再 +1 得到 2（即 3月），日期设为 0 → 2月最后一天
  return new Date(year, month, 0).getDate();
}

export default function SignInCalendar({ ym = "202510", markDayArr = [1, 2] }) {
  let firstDate = new Date(
    ym.substring(0, 4) + "-" + ym.substring(4) + "-" + "01",
  );
  let cells = [];
  const w1 = firstDate.getDay();
  for (let i = 0; i < (w1 + 6) % 7; i++) {
    cells.push(0);
  }

  const daysInMonth = getDaysInMonth(
    parseInt(ym.substring(0, 4)),
    parseInt(ym.substring(4, 6)),
  );
  for (let day = 1; day <= daysInMonth; day++) {
    if (markDayArr.includes(day)) {
      cells.push(day);
    } else {
      cells.push(0);
    }
  }

  let endDate = new Date(
    ym.substring(0, 4) + "-" + ym.substring(4) + "-" + "01",
  );
  endDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  const w2 = endDate.getDay();
  if (w2 != 0) {
    for (let i = 0; i < 7 - w2; i++) {
      cells.push(0);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full grid-cols-7 place-items-center gap-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="flex size-4 items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid w-full grid-cols-7 place-items-center gap-2">
        {cells.map((day, index) => (
          <div
            key={index}
            className={clsx(
              "flex size-4 cursor-pointer items-center justify-center rounded-md",
              day > 0
                ? "bg-green-200 dark:bg-green-300"
                : "bg-gray-100 dark:bg-gray-700",
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
