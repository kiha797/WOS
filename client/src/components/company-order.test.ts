import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeVisibleCompanyOrder, normalizeCompanyOrder } from "./use-company-order";

const companies = ["동원약품", "신덕약품", "보덕메디팜", "아이팜코리아", "인천약품", "신덕팜"];

test("invalid saved order uses the provided company order", () => {
  for (const value of [null, undefined, {}, "invalid", 123]) {
    assert.deepEqual(normalizeCompanyOrder(value, companies), companies);
  }
});

test("saved order removes unknown companies and duplicates and appends missing companies", () => {
  assert.deepEqual(
    normalizeCompanyOrder(["신덕팜", "unknown", "신덕팜", 123, "신덕약품"], companies),
    ["신덕팜", "신덕약품", "동원약품", "보덕메디팜", "아이팜코리아", "인천약품"],
  );
});

test("all six companies can be reordered without changing membership", () => {
  assert.deepEqual(
    mergeVisibleCompanyOrder(companies, companies, [...companies].reverse(), companies),
    [...companies].reverse(),
  );
});

test("reordering visible companies keeps hidden-company positions", () => {
  assert.deepEqual(
    mergeVisibleCompanyOrder(
      companies,
      ["동원약품", "아이팜코리아"],
      ["아이팜코리아", "동원약품"],
      companies,
    ),
    ["아이팜코리아", "신덕약품", "보덕메디팜", "동원약품", "인천약품", "신덕팜"],
  );
});

test("partial proposed order cannot drop visible companies or introduce unknown ones", () => {
  assert.deepEqual(
    mergeVisibleCompanyOrder(
      companies,
      companies.slice(0, 3),
      ["보덕메디팜", "unknown", "보덕메디팜"],
      companies,
    ),
    ["보덕메디팜", "동원약품", "신덕약품", "아이팜코리아", "인천약품", "신덕팜"],
  );
});

test("newly available companies append without discarding an existing preference", () => {
  assert.deepEqual(
    normalizeCompanyOrder(["신덕약품", "동원약품"], companies.slice(0, 4)),
    ["신덕약품", "동원약품", "보덕메디팜", "아이팜코리아"],
  );
});
