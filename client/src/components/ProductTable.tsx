import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface ProductData {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  packaging: string;
  price: number;
  stock: number;
}

interface ProductTableProps {
  products: ProductData[];
  onAddToCart?: (productId: string, quantity: number) => void;
}

export function ProductTable({ products, onAddToCart }: ProductTableProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, numValue)
    }));
  };

  const incrementQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decrementQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const handleAddToCart = (product: ProductData) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      onAddToCart?.(product.id, quantity);
      console.log(`장바구니에 추가: ${product.name} x ${quantity}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="h-9">
              <TableHead className="w-[120px] h-9 py-2 text-xs">제품코드</TableHead>
              <TableHead className="h-9 py-2 text-xs">제품명</TableHead>
              <TableHead className="w-[120px] h-9 py-2 text-xs">제조사</TableHead>
              <TableHead className="w-[100px] h-9 py-2 text-xs">규격</TableHead>
              <TableHead className="w-[100px] h-9 py-2 text-right text-xs">재고</TableHead>
              <TableHead className="w-[120px] h-9 py-2 text-right text-xs">단가</TableHead>
              <TableHead className="w-[160px] h-9 py-2 text-center text-xs">주문수량</TableHead>
              <TableHead className="w-[100px] h-9 py-2 text-center text-xs">담기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => {
              const quantity = quantities[product.id] || 0;
              return (
                <TableRow key={product.id} data-testid={`product-row-${product.id}`} className="h-9">
                  <TableCell className="font-mono text-xs py-1.5">{product.code}</TableCell>
                  <TableCell className="font-medium text-sm py-1.5">{product.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground py-1.5">{product.manufacturer}</TableCell>
                  <TableCell className="text-xs py-1.5">{product.packaging}</TableCell>
                  <TableCell className="text-right py-1.5">
                    <Badge variant={product.stock > 0 ? "default" : "destructive"} className="font-mono text-xs h-5">
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5">
                    {product.price.toLocaleString()}원
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => decrementQuantity(product.id)}
                        disabled={quantity === 0}
                        data-testid={`button-decrease-${product.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-14 h-7 text-center text-xs px-1"
                        data-testid={`input-quantity-${product.id}`}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => incrementQuantity(product.id)}
                        data-testid={`button-increase-${product.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-1">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={quantity === 0}
                      className="h-7 text-xs px-3"
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      담기
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                data-testid="pagination-previous"
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                    data-testid={`pagination-page-${page}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                data-testid="pagination-next"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
