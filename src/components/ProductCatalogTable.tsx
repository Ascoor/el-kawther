import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NormalizedProduct } from '@/lib/products/loadProducts';

type Props = {
  products: NormalizedProduct[];
};

export function ProductCatalogTable({ products }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, NormalizedProduct[]>();
    for (const product of products) {
      const key = product.category || 'Uncategorized';
      map.set(key, [...(map.get(key) ?? []), product]);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  return (
    <div className="space-y-6">
      {grouped.map(([category, items]) => (
        <Card key={category} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">{category}</div>
              <Badge variant="secondary">{items.length}</Badge>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2 text-left">Title</th>
                    <th className="py-2 text-left">Brand</th>
                    <th className="py-2 text-left">Collection</th>
                    <th className="py-2 text-left">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id} className="border-b last:border-b-0">
                      <td className="py-2 font-medium">{product.title}</td>
                      <td className="py-2">{product.brand || '—'}</td>
                      <td className="py-2">
                        <Badge variant="outline" className="capitalize">
                          {product.collection}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Badge variant="secondary">{product.source}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
