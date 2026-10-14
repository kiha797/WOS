import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, AlertTriangle, HelpCircle } from "lucide-react";

export default function BalancePaymentPage() {
  const [balanceType, setBalanceType] = useState("current");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("general");
  const [cardSelection, setCardSelection] = useState("direct");
  const [cardType, setCardType] = useState("shinhan");
  const [cardNumber1, setCardNumber1] = useState("");
  const [cardNumber2, setCardNumber2] = useState("");
  const [cardNumber3, setCardNumber3] = useState("");
  const [cardNumber4, setCardNumber4] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [installment, setInstallment] = useState("");
  const [cardPaymentPeriod, setCardPaymentPeriod] = useState("thisMonth");
  const [depositPeriod, setDepositPeriod] = useState("thisMonth");
  const [showMyCardDialog, setShowMyCardDialog] = useState(false);
  const [myCardName, setMyCardName] = useState("");
  const [myCardCompany, setMyCardCompany] = useState("");
  const [myCardNum1, setMyCardNum1] = useState("");
  const [myCardNum2, setMyCardNum2] = useState("");
  const [myCardNum3, setMyCardNum3] = useState("");
  const [myCardNum4, setMyCardNum4] = useState("");
  const [myCardExpiry, setMyCardExpiry] = useState("");
  const [myCardPin, setMyCardPin] = useState("");

  const balanceOptions = [
    { id: "current", label: "현재 잔고", amount: "20,370,332" },
    { id: "mid15", label: "당월15일 잔고", amount: "19,045,044" },
    { id: "prevDay", label: "전일말 잔고", amount: "11,532,606" },
    { id: "requested", label: "결제 요청금액", amount: "11,000,000" },
  ];

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold" data-testid="text-page-title">결제</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4 text-blue-600" />
          <span className="font-medium">공지사항</span>
          <span className="text-gray-500">타사이트를 통한 주문 관련 공...</span>
          <div className="flex items-center gap-1 text-gray-400">
            <span>①</span>
            <span>②</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-[400px] flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-3" data-testid="text-section-balance">결제금액 입력</h2>
            <RadioGroup value={balanceType} onValueChange={setBalanceType} className="space-y-2">
              {balanceOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={option.id} id={option.id} data-testid={`radio-balance-${option.id}`} />
                    <Label htmlFor={option.id} className="text-sm cursor-pointer">{option.label}</Label>
                  </div>
                  <span className="text-sm font-medium">{option.amount} 원</span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold whitespace-nowrap" data-testid="text-section-payment-amount">결제금액</h2>
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="text"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="text-right"
                  placeholder="0"
                  data-testid="input-payment-amount"
                />
                <span className="text-sm">원</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2 justify-end">
              <AlertTriangle className="h-3 w-3" />
              <span>데이터가 없습니다.</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-semibold mb-3" data-testid="text-section-card-payment">카드결제</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Label className="text-xs w-16 shrink-0">결제방법</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="general" id="general" data-testid="radio-payment-general" />
                    <Label htmlFor="general" className="text-xs cursor-pointer">일반결제</Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="simple" id="simple" data-testid="radio-payment-simple" />
                    <Label htmlFor="simple" className="text-xs cursor-pointer">카드 간편결제</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-xs w-16 shrink-0">카드선택</Label>
                {paymentMethod === "general" && (
                  <Select value={cardSelection} onValueChange={setCardSelection}>
                    <SelectTrigger className="w-32 h-8 text-xs" data-testid="select-card-selection">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">직접 입력</SelectItem>
                      <SelectItem value="saved">저장된 카드</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="sm" className="h-8 text-xs" data-testid="button-my-card-info" onClick={() => setShowMyCardDialog(true)}>
                  나의 카드정보
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <Label className="text-xs w-16 shrink-0 mt-2"></Label>
                <RadioGroup value={cardType} onValueChange={setCardType} className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="shinhan" id="shinhan" data-testid="radio-card-shinhan" />
                    <Label htmlFor="shinhan" className="text-xs cursor-pointer">신한, 롯데, 비씨</Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="samsung" id="samsung" data-testid="radio-card-samsung" />
                    <Label htmlFor="samsung" className="text-xs cursor-pointer">삼성, 현대, 국민</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-xs w-16 shrink-0">카드번호</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    maxLength={4}
                    value={cardNumber1}
                    onChange={(e) => setCardNumber1(e.target.value)}
                    className="w-16 h-8 text-xs text-center"
                    data-testid="input-card-number-1"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="password"
                    maxLength={4}
                    value={cardNumber2}
                    onChange={(e) => setCardNumber2(e.target.value)}
                    className="w-16 h-8 text-xs text-center"
                    data-testid="input-card-number-2"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="password"
                    maxLength={4}
                    value={cardNumber3}
                    onChange={(e) => setCardNumber3(e.target.value)}
                    className="w-16 h-8 text-xs text-center"
                    data-testid="input-card-number-3"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="text"
                    maxLength={4}
                    value={cardNumber4}
                    onChange={(e) => setCardNumber4(e.target.value)}
                    className="w-16 h-8 text-xs text-center"
                    data-testid="input-card-number-4"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-xs w-16 shrink-0">유효기간</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    maxLength={2}
                    placeholder="MM"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    className="w-12 h-8 text-xs text-center"
                    data-testid="input-expiry-month"
                  />
                  <span className="text-gray-400">/</span>
                  <Input
                    type="text"
                    maxLength={2}
                    placeholder="YY"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    className="w-12 h-8 text-xs text-center"
                    data-testid="input-expiry-year"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-xs w-16 shrink-0">할부</Label>
                <Select value={installment} onValueChange={setInstallment}>
                  <SelectTrigger className="w-32 h-8 text-xs" data-testid="select-installment">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">일시불</SelectItem>
                    <SelectItem value="2">2개월</SelectItem>
                    <SelectItem value="3">3개월</SelectItem>
                    <SelectItem value="6">6개월</SelectItem>
                    <SelectItem value="12">12개월</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8" data-testid="button-payment-submit">
                결제
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <Card className="rounded-sm">
            <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold" data-testid="text-section-card-history">카드결제현황</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">2025-08-01 ~ 2026-02-28</span>
                <div className="flex items-center border rounded overflow-hidden shrink-0">
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${cardPaymentPeriod === "today" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("today")}
                    data-testid="button-card-period-today"
                  >
                    당일
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${cardPaymentPeriod === "thisMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("thisMonth")}
                    data-testid="button-card-period-this-month"
                  >
                    당월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${cardPaymentPeriod === "lastMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("lastMonth")}
                    data-testid="button-card-period-last-month"
                  >
                    전월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${cardPaymentPeriod === "3months" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("3months")}
                    data-testid="button-card-period-3months"
                  >
                    3개월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${cardPaymentPeriod === "6months" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("6months")}
                    data-testid="button-card-period-6months"
                  >
                    6개월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${cardPaymentPeriod === "1year" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setCardPaymentPeriod("1year")}
                    data-testid="button-card-period-1year"
                  >
                    1년
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center gap-4 text-xs mb-2">
                <span>결제건수 <strong className="text-blue-600">2</strong>건</span>
                <span>결제금액 <strong className="text-blue-600">21,000,000</strong>원</span>
              </div>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-7">
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">순번</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">승인일자</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">할부</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">결제금액</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">카드회사명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="h-8 hover:bg-gray-50">
                    <TableCell className="py-1 text-xs text-center">1</TableCell>
                    <TableCell className="py-1 text-xs text-center">2026-01-27</TableCell>
                    <TableCell className="py-1 text-xs text-center"></TableCell>
                    <TableCell className="py-1 text-xs text-center">10,000,000</TableCell>
                    <TableCell className="py-1 text-xs text-center text-blue-600">신한엘지</TableCell>
                  </TableRow>
                  <TableRow className="h-8 hover:bg-gray-50">
                    <TableCell className="py-1 text-xs text-center">2</TableCell>
                    <TableCell className="py-1 text-xs text-center">2025-12-30</TableCell>
                    <TableCell className="py-1 text-xs text-center"></TableCell>
                    <TableCell className="py-1 text-xs text-center">11,000,000</TableCell>
                    <TableCell className="py-1 text-xs text-center text-blue-600">신한엘지</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold" data-testid="text-section-deposit-history">입금현황</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">2025-12-01 ~ 2025-12-31</span>
                <div className="flex items-center border rounded overflow-hidden shrink-0">
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${depositPeriod === "thisMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDepositPeriod("thisMonth")}
                    data-testid="button-deposit-period-this-month"
                  >
                    당월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${depositPeriod === "lastMonth" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDepositPeriod("lastMonth")}
                    data-testid="button-deposit-period-last-month"
                  >
                    전월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${depositPeriod === "3months" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDepositPeriod("3months")}
                    data-testid="button-deposit-period-3months"
                  >
                    3개월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] border-r whitespace-nowrap ${depositPeriod === "6months" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDepositPeriod("6months")}
                    data-testid="button-deposit-period-6months"
                  >
                    6개월
                  </button>
                  <button
                    className={`h-5 px-1.5 text-[10px] whitespace-nowrap ${depositPeriod === "1year" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDepositPeriod("1year")}
                    data-testid="button-deposit-period-1year"
                  >
                    1년
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center gap-4 text-xs mb-2">
                <span>입금건수 <strong className="text-blue-600">0</strong>건</span>
                <span>입금금액 <strong className="text-blue-600">0</strong>원</span>
                <span>수금할인 <strong className="text-blue-600">0</strong>원</span>
              </div>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-7">
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">순번</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">승인일자</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">승인시간</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">입금금액</TableHead>
                    <TableHead className="h-7 py-1 text-xs text-center font-medium">수금할인</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-xs text-gray-500 py-8">
                      조회된 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 나의 카드정보 팝업 */}
      <Dialog open={showMyCardDialog} onOpenChange={setShowMyCardDialog}>
        <DialogContent className="max-w-3xl p-0 gap-0" data-testid="dialog-my-card">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-sm font-semibold">마이카드</DialogTitle>
          </DialogHeader>
          <div className="flex divide-x">
            {/* 좌측: 나의 카드정보 목록 */}
            <div className="flex-1 p-4">
              <h3 className="text-xs font-semibold mb-3 text-gray-700">나의 카드정보</h3>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="h-8">
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">카드 명칭</TableHead>
                    <TableHead className="h-8 py-1 text-xs text-center font-medium">등록 카드 정보</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-xs text-gray-400">
                      등록된 카드가 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* 우측: 나의카드 상세정보 */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-700">나의카드 상세정보</h3>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 px-3 text-xs bg-[#1e3a6e] text-white" data-testid="button-card-register">
                    카드등록
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs" data-testid="button-card-back" onClick={() => setShowMyCardDialog(false)}>
                    뒤로가기
                  </Button>
                </div>
              </div>

              <div className="border rounded-sm">
                <div className="flex items-center border-b bg-gray-50">
                  <div className="w-full py-1 px-3 text-xs text-center font-medium text-gray-700">신용/체크카드</div>
                </div>
                <div className="space-y-0 divide-y">
                  <div className="flex items-center">
                    <div className="w-28 shrink-0 px-3 py-2 text-xs text-gray-600 bg-gray-50 border-r font-medium">카드명칭</div>
                    <div className="flex-1 px-2 py-1">
                      <Input
                        value={myCardName}
                        onChange={(e) => setMyCardName(e.target.value)}
                        placeholder="입력"
                        className="h-7 text-xs border-0 shadow-none focus-visible:ring-0 p-0 pl-1"
                        data-testid="input-my-card-name"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 shrink-0 px-3 py-2 text-xs text-gray-600 bg-gray-50 border-r font-medium">카드회사</div>
                    <div className="flex-1 px-2 py-1">
                      <Select value={myCardCompany} onValueChange={setMyCardCompany}>
                        <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0" data-testid="select-my-card-company">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shinhan">신한카드</SelectItem>
                          <SelectItem value="samsung">삼성카드</SelectItem>
                          <SelectItem value="hyundai">현대카드</SelectItem>
                          <SelectItem value="kb">국민카드</SelectItem>
                          <SelectItem value="lotte">롯데카드</SelectItem>
                          <SelectItem value="bc">BC카드</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 shrink-0 px-3 py-2 text-xs text-gray-600 bg-gray-50 border-r font-medium">카드번호</div>
                    <div className="flex-1 px-2 py-1 flex items-center gap-1">
                      <Input value={myCardNum1} onChange={(e) => setMyCardNum1(e.target.value)} maxLength={4} placeholder="####" className="w-12 h-7 text-xs text-center" data-testid="input-my-card-num1" />
                      <span className="text-gray-400 text-xs">-</span>
                      <Input value={myCardNum2} onChange={(e) => setMyCardNum2(e.target.value)} maxLength={4} placeholder="####" className="w-12 h-7 text-xs text-center" data-testid="input-my-card-num2" />
                      <span className="text-gray-400 text-xs">-</span>
                      <Input value={myCardNum3} onChange={(e) => setMyCardNum3(e.target.value)} maxLength={4} placeholder="####" className="w-12 h-7 text-xs text-center" data-testid="input-my-card-num3" />
                      <span className="text-gray-400 text-xs">-</span>
                      <Input value={myCardNum4} onChange={(e) => setMyCardNum4(e.target.value)} maxLength={4} placeholder="####" className="w-12 h-7 text-xs text-center" data-testid="input-my-card-num4" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 shrink-0 px-3 py-2 text-xs text-gray-600 bg-gray-50 border-r font-medium">유효기간</div>
                    <div className="flex-1 px-2 py-1">
                      <Input value={myCardExpiry} onChange={(e) => setMyCardExpiry(e.target.value)} placeholder="MM / YY" className="h-7 text-xs w-24" data-testid="input-my-card-expiry" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 shrink-0 px-3 py-2 text-xs text-gray-600 bg-gray-50 border-r font-medium flex items-center gap-1">
                      간편결제 비밀번호
                      <HelpCircle className="h-3 w-3 text-gray-400 shrink-0" />
                    </div>
                    <div className="flex-1 px-2 py-1">
                      <Input value={myCardPin} onChange={(e) => setMyCardPin(e.target.value)} placeholder="4자리 이상" type="password" className="h-7 text-xs w-32" data-testid="input-my-card-pin" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
