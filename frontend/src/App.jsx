import { useEffect, useState } from 'react';
import axios from 'axios';
import ping from './assets/ping.jpg';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('ongoing');
  const [isFiltering, setIsFiltering] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const API = '/api/todos';

  const completedCount = todos.filter((t) => t.completed).length;
  const ongoingCount = todos.filter((t) => !t.completed).length;
  const progressPercent =
    todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const filteredTodos = todos.filter((todo) =>
    filter === 'ongoing' ? !todo.completed : todo.completed
  );

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.error('목록 불러오기 실패:', err);
    }
  };

  const addTodo = async () => {
    try {
      if (!title.trim()) return;
      await axios.post(API, { title });
      setTitle('');
      fetchTodos();
    } catch (err) {
      console.error('추가 실패:', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API}/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id) => {
    try {
      if (!editingTitle.trim()) return;
      await axios.put(`${API}/${id}`, { title: editingTitle });
      setEditingId(null);
      setEditingTitle('');
      fetchTodos();
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.phoneFrame}>
        <div style={styles.profileCard}>
          <div style={styles.profileLeft}>
            <div style={styles.profileImageWrap}>
              <img
                src={ping}
                alt="profile"
                style={styles.profileImage}
              />
            </div>
            <div style={styles.barcode} />
          </div>

          <div style={styles.profileRight}>
            <div style={styles.laceHeader}>
              <div style={styles.laceBand} />
              <div style={styles.laceTrim} />
              <div style={styles.centerBow}>🎀</div>
            </div>

            <div style={styles.infoGrid}>
              <div>
                <div style={styles.label}>NAME</div>
                <div style={styles.valueDate}>username</div>
              </div>
              <div>
                <div style={styles.label}>BIRTHDAY</div>
                <div style={styles.valueDate}>20XX-XX-XX</div>
              </div>
              <div>
                <div style={styles.label}>STUDENT NUMBER</div>
                <div style={styles.valueDate}>2024XXXX</div>
              </div>
              <div>
                <div style={styles.label}>TODO TYPE</div>
                <div style={styles.valueSmall}>daily ♡</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Completed</div>
            <div style={styles.statValue}>
              {completedCount}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>In Progress</div>
            <div style={styles.statValue}>
              {ongoingCount}
            </div>
          </div>
        </div>

        <div style={styles.todoHeaderRow}>
          <div style={styles.todoTitle}>To-do</div>
          <select
            style={styles.selectBox}
            value={filter}
            onChange={(e) => {
              setIsFiltering(true);
              setFilter(e.target.value);
              setTimeout(() => setIsFiltering(false), 220);
            }}
          >
            <option value="ongoing">Ongoing</option>
            <option value="done">Done</option>
          </select>

          <button style={styles.plusButton} onClick={addTodo}>
            +
          </button>
        </div>

        <div style={styles.inputRow}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo();
            }}
            placeholder="할 일을 입력하세요"
            style={styles.input}
          />
        </div>

        <div style={styles.listWrap}>
          {filteredTodos.map((todo, index) => {
            const icons = ['🎬', '🧽', '🫧', '🖋️', '📎', '💗', '🍓'];
            const icon = icons[index % icons.length];

            return (
              <div key={todo._id} style={styles.todoCard}>
                <div style={styles.todoLeft}>
                  <div style={styles.todoEmoji}>{icon}</div>
                  <div>
                    {editingId === todo._id ? (
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo._id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        style={styles.editInput}
                      />
                    ) : (
                      <div
                        style={{
                          ...styles.todoText,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          opacity: todo.completed ? 0.55 : 1
                        }}
                      >
                        {todo.title}
                      </div>
                    )}
                    <div style={styles.todoSubText}>
                      Daily To-do&apos;s | {todo.completed ? 'Completed' : 'In progress'}
                    </div>
                  </div>
                </div>

                <div style={styles.todoActions}>
                  <button
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    style={{
                      ...styles.checkButton,
                      background: todo.completed ? '#ffd8e6' : '#ffffff'
                    }}
                    title="완료 체크"
                  >
                    {todo.completed ? '✓' : ''}
                  </button>

                  {editingId === todo._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo._id)}
                        style={styles.editButton}
                      >
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={styles.deleteButton}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        style={styles.editButton}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        style={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* 하단 감성 카드 */}
        <div style={styles.footerCard}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>
            💌 Today Memo
          </div>
          <div style={{ color: '#666' }}>
            오늘도 할 일 하나씩 끝내보자 ✨
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f9eef3',
    padding: '28px 16px',
    fontFamily:
      '"Trebuchet MS", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
  },
  phoneFrame: {
    maxWidth: '760px',
    margin: '0 auto',
    background: '#fffdfd',
    borderRadius: '28px',
    padding: '22px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    border: '2px solid #f1d6df'
  },
  profileCard: {
    background: '#f8dbe7',
    border: '2px solid #3a2f35',
    borderRadius: '24px',
    padding: '18px',
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '18px',
    marginBottom: '28px'
  },
  profileLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  profileImageWrap: {
    border: '3px solid #3a2f35',
    background: '#fff',
    padding: '8px',
    borderRadius: '4px'
  },
  profileImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    display: 'block'
  },
  barcode: {
    height: '46px',
    borderRadius: '4px',
    background:
      'repeating-linear-gradient(90deg, #111 0 4px, transparent 4px 8px, #111 8px 10px, transparent 10px 14px)'
  },
  profileRight: {
    position: 'relative',
    paddingTop: '12px'
  },
  topRibbon: {
    fontSize: '68px',
    textAlign: 'center',
    marginBottom: '8px'
  },
  dashedLine: {
    borderTop: '4px dashed #3a2f35',
    margin: '10px 0 18px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '26px 56px',
    alignItems: 'start',
    marginTop: '8px'
  },
  label: {
    fontSize: '12px',
    color: '#6b5660',
    letterSpacing: '0.12em',
    marginBottom: '10px',
    fontWeight: 500
  },
  value: {
    fontSize: '30px',
    fontWeight: 700,
    color: '#2c2025',
    lineHeight: 1.15
  },
  valueSmall: {
    fontSize: '25px',
    fontWeight: 700,
    color: '#2c2025',
    lineHeight: 1.15
  },
  todoHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px'
  },
  todoTitle: {
    fontSize: '52px',
    fontStyle: 'italic',
    color: '#3b2e35',
    fontFamily: 'Georgia, serif'
  },
  selectBox: {
    border: '3px solid #3b2e35',
    borderRadius: '14px',
    padding: '10px 16px',
    background: '#d8e9ff',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1f2430'
  },
  plusButton: {
    marginLeft: 'auto',
    width: '58px',
    height: '58px',
    borderRadius: '999px',
    border: 'none',
    background: '#1f1c29',
    color: 'white',
    fontSize: '34px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  inputRow: {
    marginBottom: '18px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '2px solid #d8c7cf',
    borderRadius: '18px',
    padding: '18px 20px',
    fontSize: '20px',
    background: '#fff'
  },
  listWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  todoCard: {
    background: '#fff',
    border: '3px solid #3b2e35',
    borderRadius: '20px',
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  todoLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: 0
  },
  todoEmoji: {
    fontSize: '44px',
    width: '58px',
    textAlign: 'center'
  },
  todoText: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e1d23',
    wordBreak: 'break-word'
  },
  todoSubText: {
    fontSize: '15px',
    color: '#5f6b44',
    marginTop: '4px',
    fontWeight: 600
  },
  todoActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  checkButton: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    border: '3px solid #3b2e35',
    fontSize: '26px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  deleteButton: {
    border: 'none',
    background: '#f8a0bc',
    color: '#fff',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#fff',
    border: '2px solid #3b2e35',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center'
  },

  statTitle: {
    fontSize: '14px',
    color: '#777'
  },

  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ff6b9d'
  },

  footerCard: {
    marginTop: '30px',
    padding: '20px',
    borderRadius: '16px',
    background: '#fff0f5',
    border: '2px dashed #ffb6c1',
    textAlign: 'center'
  },

  laceHeader: {
    position: 'relative',
    height: '72px',
    marginBottom: '18px'
  },

  laceBand: {
    position: 'absolute',
    top: '8px',
    left: 0,
    right: 0,
    height: '28px',
    background: 'rgba(255,255,255,0.45)',
    borderRadius: '999px',
    border: '2px solid #f3d8e4',
    boxShadow: 'inset 0 -2px 0 rgba(255,255,255,0.7)'
  },

  laceTrim: {
    position: 'absolute',
    top: '41px',
    left: '18px',
    right: '18px',
    height: '16px',
    background:
      'radial-gradient(circle at 8px 0px, #fff 8px, transparent 9px) repeat-x',
    backgroundSize: '16px 16px',
    borderBottom: '3px dotted #f1b9cb',
    opacity: 0.95
  },

  centerBow: {
    position: 'absolute',
    top: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '52px',
    lineHeight: 1,
    filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.08))'
  },

  valueDate: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#2c2025',
    lineHeight: 1.15,
    letterSpacing: '0.01em'
  },
  editButton: {
    border: 'none',
    color: '#f8a0bc',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    background: '#fff0f5',
    border: '1px solid #ffb6c1',
    cursor: 'pointer'
  },
  editInput: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e1d23',
    padding: '8px 10px',
    borderRadius: '10px',
    border: '2px solid #d8c7cf',
    width: '220px',
    outline: 'none'
  },
  
};

export default App;