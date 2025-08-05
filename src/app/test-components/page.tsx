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
      className="bg-surface"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* ボタンコンポーネント */}
        <Card shadow="lg" padding="lg">
          <h2 className="text-heading mb-6 text-primary">ボタンコンポーネント</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-subheading mb-3 text-secondary">バリエーション</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="primary">墨色</Button>
                <Button variant="secondary">利休茶</Button>
                <Button variant="danger">赤茶</Button>
                <Button variant="ghost">透明</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-subheading mb-3 text-secondary">サイズ</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-subheading mb-3 text-secondary">状態</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button loading={isLoading} onClick={handleButtonClick}>
                  {isLoading ? 'Loading...' : 'ローディングテスト'}
                </Button>
                <Button icon={<HeartIcon />}>アイコン付き</Button>
                <Button disabled>無効状態</Button>
              </div>
            </div>
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
        <div className="space-y-4">
          <h2 className="text-heading text-primary">カードコンポーネント</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card shadow="sm" padding="sm">
              <div className="w-6 h-6 bg-primary rounded-sm mb-3 opacity-80"></div>
              <h3 className="text-body font-medium text-primary">墨色カード</h3>
              <p className="text-caption text-tertiary mt-1">控えめな影と余白</p>
            </Card>
            
            <Card shadow="md" padding="md" hover>
              <div className="w-6 h-6 bg-secondary rounded-sm mb-3 opacity-80"></div>
              <h3 className="text-body font-medium text-secondary">利休茶カード</h3>
              <p className="text-caption text-tertiary mt-1">ホバーで優雅に浮き上がる</p>
            </Card>
            
            <Card 
              shadow="lg" 
              padding="lg" 
              onClick={() => alert('和の心でクリックされました')}
            >
              <div className="w-6 h-6 bg-accent rounded-sm mb-3 opacity-80"></div>
              <h3 className="text-body font-medium text-accent-dark">深緑カード</h3>
              <p className="text-caption text-tertiary mt-1">クリックで静かな反応</p>
            </Card>
          </div>
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
        <Card shadow="lg" padding="lg">
          <h2 className="text-heading mb-6 text-primary">タイポグラフィ</h2>
          <div className="space-y-6">
            <div className="p-6 bg-gradient-washi rounded-lg border border-border-light">
              <h1 className="text-display text-primary">一瞥</h1>
              <p className="text-caption text-tertiary mt-2">Display Text - 和の美しさでアプリタイトル</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-heading">店舗の物語を静かに紡ぐ</h2>
                <p className="text-caption text-tertiary">Heading Text - 和の心でセクション見出し</p>
              </div>
              
              <div>
                <h3 className="text-subheading">心に響く出会いを大切に</h3>
                <p className="text-caption text-tertiary">Subheading Text - 落ち着いたサブセクション</p>
              </div>
              
              <div>
                <p className="text-body">
                  これは本文用のテキストです。店舗の物語や想いを和の美しさで伝えるために、
                  読みやすさと品格を重視したタイポグラフィを設計しています。
                  日本の伝統色と現代的な読みやすさを調和させました。
                </p>
                <p className="text-caption text-tertiary">Body Text - 和の心で本文を美しく</p>
              </div>
              
              <div>
                <p className="text-caption">補足情報や説明文も、和の落ち着いた雰囲気で表現します。</p>
                <p className="text-small text-tertiary">Caption Text - 控えめで上品な補足情報</p>
              </div>
            </div>
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