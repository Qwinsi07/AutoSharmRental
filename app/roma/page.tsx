"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  LogOut,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginPage } from "../admin/login";
import { verifyAdminSession, logoutAdmin } from "../admin/actions";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  createNews,
  getNews,
  updateNews,
  deleteNews,
} from "../admin/db-actions";
import type { Vehicle, NewsItem } from "@/lib/data";

export default function RomaAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await verifyAdminSession();
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Lock className="w-12 h-12 text-gold mx-auto animate-pulse" />
          <p className="text-gold">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminContent onLogout={handleLogout} />;
}

function AdminContent({ onLogout }: { onLogout: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadVehicles();
    loadNews();
  }, []);

  const loadVehicles = async () => {
    setVehiclesLoading(true);
    const result = await getVehicles();
    if (result.success) {
      setVehicles(result.data || []);
    } else {
      setError(`Failed to load vehicles: ${result.error}`);
    }
    setVehiclesLoading(false);
  };

  const loadNews = async () => {
    setNewsLoading(true);
    const result = await getNews();
    if (result.success) {
      setNews(result.data || []);
    } else {
      setError(`Failed to load news: ${result.error}`);
    }
    setNewsLoading(false);
  };

  const handleAddVehicle = async (data: Omit<Vehicle, "id">) => {
    const result = await createVehicle(data);
    if (result.success) {
      await loadVehicles();
      setVehicleDialogOpen(false);
    } else {
      setError(`Failed to add vehicle: ${result.error}`);
    }
  };

  const handleUpdateVehicle = async (data: Partial<Vehicle>) => {
    if (!editingVehicle) return;
    const result = await updateVehicle(editingVehicle.id, data);
    if (result.success) {
      await loadVehicles();
      setEditingVehicle(null);
    } else {
      setError(`Failed to update vehicle: ${result.error}`);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      const result = await deleteVehicle(id);
      if (result.success) {
        await loadVehicles();
      } else {
        setError(`Failed to delete vehicle: ${result.error}`);
      }
    }
  };

  const handleAddNews = async (data: Omit<NewsItem, "id">) => {
    const result = await createNews(data);
    if (result.success) {
      await loadNews();
      setNewsDialogOpen(false);
    } else {
      setError(`Failed to add news: ${result.error}`);
    }
  };

  const handleUpdateNews = async (data: Partial<NewsItem>) => {
    if (!editingNews) return;
    const result = await updateNews(editingNews.id, data);
    if (result.success) {
      await loadNews();
      setEditingNews(null);
    } else {
      setError(`Failed to update news: ${result.error}`);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Are you sure you want to delete this news?")) {
      const result = await deleteNews(id);
      if (result.success) {
        await loadNews();
      } else {
        setError(`Failed to delete news: ${result.error}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-card">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoautosharm-zTR2GiuqqtlDQmiyiSnDy9edrXLJqV.jpeg"
                  alt="AutoSharm Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h1 className="font-bold">Admin Dashboard</h1>
                <p className="text-xs text-primary-foreground/70">Roma Access</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/">
                  <span className="text-xs">Exit</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-3 lg:gap-2">
            <TabsTrigger value="vehicles" className="gap-2">
              <Car className="w-4 h-4" /> Vehicles
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" /> News
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Vehicles</CardTitle>
                <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
                      <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                    </DialogHeader>
                    <VehicleForm
                      onSubmit={handleAddVehicle}
                      onCancel={() => setVehicleDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={!!editingVehicle}
                  onOpenChange={(open) => !open && setEditingVehicle(null)}
                >
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Vehicle</DialogTitle>
                    </DialogHeader>
                    {editingVehicle && (
                      <VehicleForm
                        vehicle={editingVehicle}
                        onSubmit={handleUpdateVehicle}
                        onCancel={() => setEditingVehicle(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <p className="text-center text-muted-foreground py-8">
                    Loading vehicles...
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.name}</TableCell>
                            <TableCell className="capitalize">{vehicle.category}</TableCell>
                            <TableCell>
                              {vehicle.currency === "EGP" ? "EGP " : "$"}
                              {vehicle.price.toLocaleString()}
                              {vehicle.listingType === "rent" && `/${vehicle.rentalPeriod}`}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{vehicle.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingVehicle(vehicle)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteVehicle(vehicle.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {vehicles.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No vehicles yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage News</CardTitle>
                <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
                      <Plus className="w-4 h-4 mr-2" /> Add News
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add News Update</DialogTitle>
                    </DialogHeader>
                    <NewsForm
                      onSubmit={handleAddNews}
                      onCancel={() => setNewsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={!!editingNews}
                  onOpenChange={(open) => !open && setEditingNews(null)}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit News</DialogTitle>
                    </DialogHeader>
                    {editingNews && (
                      <NewsForm
                        newsItem={editingNews}
                        onSubmit={handleUpdateNews}
                        onCancel={() => setEditingNews(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {newsLoading ? (
                  <p className="text-center text-muted-foreground py-8">Loading news...</p>
                ) : (
                  <div className="space-y-4">
                    {news.map((item) => (
                      <Card key={item.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingNews(item)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteNews(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {news.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No news yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Vehicle Form Component
function VehicleForm({
  vehicle,
  onSubmit,
  onCancel,
}: {
  vehicle?: Vehicle;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(
    vehicle || {
      name: "",
      category: "car",
      listingType: "rent",
      price: 0,
      currency: "USD",
      rentalPeriod: "day",
      status: "available",
      description: "",
      image: "",
      specs: {
        engine: "",
        transmission: "",
        fuel: "",
        year: new Date().getFullYear(),
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Vehicle Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Toyota Camry 2023"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="scooter">Scooter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Listing Type</label>
          <Select
            value={formData.listingType}
            onValueChange={(value) =>
              setFormData({ ...formData, listingType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Price</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            placeholder="0.00"
            step={0.01}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Currency</label>
          <Select
            value={formData.currency}
            onValueChange={(value) =>
              setFormData({ ...formData, currency: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="EGP">EGP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.listingType === "rent" && (
          <div>
            <label className="text-sm font-medium">Rental Period</label>
            <Select
              value={formData.rentalPeriod}
              onValueChange={(value) =>
                setFormData({ ...formData, rentalPeriod: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Vehicle details..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Engine</label>
          <Input
            value={formData.specs?.engine}
            onChange={(e) =>
              setFormData({
                ...formData,
                specs: { ...formData.specs, engine: e.target.value },
              })
            }
            placeholder="e.g., 2.0L V4"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Transmission</label>
          <Input
            value={formData.specs?.transmission}
            onChange={(e) =>
              setFormData({
                ...formData,
                specs: { ...formData.specs, transmission: e.target.value },
              })
            }
            placeholder="e.g., Automatic"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Fuel Type</label>
          <Input
            value={formData.specs?.fuel}
            onChange={(e) =>
              setFormData({
                ...formData,
                specs: { ...formData.specs, fuel: e.target.value },
              })
            }
            placeholder="e.g., Petrol"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Year</label>
          <Input
            type="number"
            value={formData.specs?.year}
            onChange={(e) =>
              setFormData({
                ...formData,
                specs: { ...formData.specs, year: parseInt(e.target.value) },
              })
            }
            placeholder="2023"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gold">
          {vehicle ? "Update" : "Add"} Vehicle
        </Button>
      </DialogFooter>
    </form>
  );
}

// News Form Component
function NewsForm({
  newsItem,
  onSubmit,
  onCancel,
}: {
  newsItem?: NewsItem;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(
    newsItem || {
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      image: "",
      readMoreUrl: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="News title..."
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="News content..."
          rows={4}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Read More URL</label>
        <Input
          value={formData.readMoreUrl}
          onChange={(e) =>
            setFormData({ ...formData, readMoreUrl: e.target.value })
          }
          placeholder="https://..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gold">
          {newsItem ? "Update" : "Add"} News
        </Button>
      </DialogFooter>
    </form>
  );
}
