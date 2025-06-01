export default function TestPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>LogicNote Test Page</h1>
      <p>如果你能看到这个页面，说明 Next.js 应用已经成功部署！</p>
      <p>当前时间：{new Date().toLocaleString()}</p>
    </div>
  )
} 