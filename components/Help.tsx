import React from 'react';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">使い方</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>分子を選択:</strong> ドロップダウンメニューから観察したい分子を選択します。</li>
          <li><strong>振動モードの再生/停止:</strong> 各振動モードの「再生」ボタンをクリックして、個別のモードを再生または停止します。</li>
          <li><strong>強度調整:</strong> 「強度調整」ボタンをクリックすると、IR（赤外）またはラマン強度に基づいて波形の振幅が調整されます。</li>
          <li><strong>IR/ラマン切り替え:</strong> 強度調整がオンの場合、IRとラマンボタンで強度のタイプを切り替えられます。</li>
        </ol>
        <p className="mt-4">
          <strong>制作者:</strong> yamnor (<a href="https://yamlab.net" target='_blank'>https://yamlab.net</a>)
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default Help;