'use client';

import { useState } from 'react';
import { 
  Button, 
  Input, 
  TextArea, 
  FormField, 
  Card, 
  Modal, 
  ConfirmDialog, 
  OptimizedImage,
  Loading,
  PageLayout 
} from '../../../components/ui';
import { HeartIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function TestComponentsPage() {
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <PageLayout 
      showNavigation 
      showBack 
      title="コンポーネントテスト"
      className="bg-gray-50"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* ボタンコンポーネント */}
        <Card>
          <h2 className="text-heading mb-4">ボタンコンポーネント</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading={isLoading} onClick={handleButtonClick}>
              Loading Test
            </Button>
            
            <Button icon={<HeartIcon />}>With Icon</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        {/* フォームコンポーネント */}
        <Card>
          <h2 className="text-heading mb-4">フォームコンポーネント</h2>
          <div className="space-y-4">
            <FormField 
              label="店舗名" 
              required 
              description="お店の正式名称を入力してください"
            >
              <Input
                value={inputValue}
                onChange={setInputValue}
                placeholder="例：一瞥カフェ"
                type="text"
              />
            </FormField>

            <FormField 
              label="店舗の物語" 
              description="300-500文字程度で店舗のこだわりや想いを記述してください"
            >
              <TextArea
                value={textAreaValue}
                onChange={setTextAreaValue}
                placeholder="お店の物語を書いてください..."
                rows={4}
                maxLength={500}
                showCharCount
              />
            </FormField>

            <Input
              value=""
              onChange={() => {}}
              placeholder="エラー例"
              error="この項目は必須です"
            />
          </div>
        </Card>

        {/* 画像コンポーネント */}
        <Card>
          <h2 className="text-heading mb-4">画像コンポーネント</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-body font-medium mb-2">通常の画像</h3>
              <OptimizedImage
                src="https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Test+Image"
                alt="テスト画像"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-body font-medium mb-2">エラー画像（存在しないURL）</h3>
              <OptimizedImage
                src="/nonexistent-image.jpg"
                alt="存在しない画像"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        </Card>

        {/* カードコンポーネント */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card shadow="sm" padding="sm">
            <h3 className="text-body font-medium">Small Card</h3>
            <p className="text-caption text-gray-600 mt-1">Shadow: sm, Padding: sm</p>
          </Card>
          
          <Card shadow="md" padding="md" hover>
            <h3 className="text-body font-medium">Medium Card (Hover)</h3>
            <p className="text-caption text-gray-600 mt-1">Shadow: md, Padding: md</p>
          </Card>
          
          <Card 
            shadow="lg" 
            padding="lg" 
            onClick={() => alert('Card clicked!')}
          >
            <h3 className="text-body font-medium">Large Card (Clickable)</h3>
            <p className="text-caption text-gray-600 mt-1">Shadow: lg, Padding: lg</p>
          </Card>
        </div>

        {/* モーダル・ダイアログ */}
        <Card>
          <h2 className="text-heading mb-4">モーダル・ダイアログ</h2>
          <div className="flex space-x-4">
            <Button onClick={() => setIsModalOpen(true)}>
              モーダルを開く
            </Button>
            <Button 
              variant="danger" 
              onClick={() => setIsConfirmOpen(true)}
            >
              確認ダイアログ
            </Button>
          </div>
        </Card>

        {/* ローディング */}
        <Card>
          <h2 className="text-heading mb-4">ローディング</h2>
          <div className="flex space-x-8">
            <div>
              <p className="text-caption mb-2">Small</p>
              <Loading size="sm" />
            </div>
            <div>
              <p className="text-caption mb-2">Medium</p>
              <Loading size="md" text="読み込み中..." />
            </div>
            <div>
              <p className="text-caption mb-2">Large</p>
              <Loading size="lg" text="データを取得しています..." />
            </div>
          </div>
        </Card>

        {/* タイポグラフィ */}
        <Card>
          <h2 className="text-heading mb-4">タイポグラフィ</h2>
          <div className="space-y-2">
            <h1 className="text-display">一瞥 Display Text</h1>
            <h2 className="text-heading">Heading Text</h2>
            <p className="text-body">Body Text - これは本文用のテキストです。読みやすさを重視したサイズと行間になっています。</p>
            <p className="text-caption">Caption Text - 補足情報や説明文に使用します。</p>
          </div>
        </Card>

      </div>

      {/* モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="テストモーダル"
        size="md"
      >
        <div className="space-y-4">
          <p>これはテスト用のモーダルです。</p>
          <p>ESCキーまたは背景クリックで閉じることができます。</p>
          <Button onClick={() => setIsModalOpen(false)}>
            閉じる
          </Button>
        </div>
      </Modal>

      {/* 確認ダイアログ */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          alert('確認されました！');
          setIsConfirmOpen(false);
        }}
        title="削除確認"
        message="この操作は取り消せません。本当に削除しますか？"
        confirmText="削除する"
        cancelText="キャンセル"
        variant="danger"
      />
    </PageLayout>
  );
}