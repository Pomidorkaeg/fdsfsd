import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Newspaper, Pencil, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import NewsEditor from '@/components/admin/news/NewsEditor';
import { NewsItem, getAllNews, createNews, updateNews, deleteNews } from '@/utils/news/newsOperations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const NewsManagement = () => {
  const queryClient = useQueryClient();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Запрос данных
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
  });

  // Мутации для создания/обновления/удаления
  const createMutation = useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Новость успешно создана');
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => newsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Новость успешно обновлена');
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Новость успешно удалена');
    },
  });

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      description: news.description,
      image: news.image,
      date: news.date.split('T')[0],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (newsData) {
      setNews(newsData);
    }
  }, [newsData]);

  const handleAddNew = () => {
    const newNewsItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: 'club',
      date: new Date().toLocaleDateString('ru-RU'),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      image: '',
      views: 0
    };
    setCurrentNews(newNewsItem);
    setEditMode(true);
  };

  const handleConfirmDelete = (newsId: string) => {
    setConfirmDelete(newsId);
  };

  const handleDeleteConfirmed = () => {
    if (!confirmDelete) return;
    
    try {
      deleteMutation.mutate(confirmDelete);
      toast({
        title: "Новость удалена",
        description: "Новость была успешно удалена",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить новость",
      });
    }
    setConfirmDelete(null);
  };

  const handleSave = (updatedNews: NewsItem) => {
    try {
      const isExisting = news.some(n => n.id === updatedNews.id);
      if (isExisting) {
        updateMutation.mutate({ id: updatedNews.id, data: updatedNews });
        toast({
          title: "Новость обновлена",
          description: "Новость успешно обновлена",
        });
      } else {
        createMutation.mutate(updatedNews);
        toast({
          title: "Новость добавлена",
          description: "Новая новость успешно добавлена",
        });
      }
      setNews(getAllNews());
      setEditMode(false);
      setCurrentNews(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить новость",
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentNews(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-fc-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-8 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-fc-green mr-3 flex items-center justify-center">
                <Newspaper className="h-4 w-4 text-white" />
              </div>
              <span>Управление новостями</span>
            </div>
          </CardTitle>
          <Button onClick={handleAddNew} className="bg-fc-green hover:bg-fc-darkGreen">
            <Plus className="mr-2 h-4 w-4" /> Добавить новость
          </Button>
        </CardHeader>
      </Card>

      {editMode && currentNews ? (
        <NewsEditor
          news={currentNews}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-xs mr-2">
                        {item.category === 'matches' ? 'Матчи' : 'Клуб'}
                      </span>
                      <span>{item.date} {item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleConfirmDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {news.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-gray-500 mb-4">Новости не найдены</div>
              <Button onClick={handleAddNew} variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Добавить первую новость
              </Button>
            </Card>
          )}
        </div>
      )}

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту новость? Это действие нельзя будет отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManagement;