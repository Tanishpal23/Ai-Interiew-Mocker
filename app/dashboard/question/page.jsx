"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  LoaderCircle,
  MoreVertical,
  Trash2,
  Sparkles,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  getUserAskedQuestionsAction,
  askAndSaveQuestionAction,
  deleteUserAskedQuestionAction,
} from "@/actions/question";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  {
    title: "Data Structures & Algorithms",
    questions: [
      {
        q: "What is the difference between a stack and a queue?",
        a: "A stack follows the LIFO (Last In, First Out) principle where elements are inserted and removed from the same end (top), like a stack of plates. A queue follows the FIFO (First In, First Out) principle where elements are inserted at the rear and removed from the front, like a line at a ticket counter.",
      },
      {
        q: "Explain the concept of Big O notation.",
        a: "Big O notation measures the upper bound of an algorithm's time or space complexity in the worst-case scenario as input size (n) grows towards infinity. It helps evaluate algorithm scalability and efficiency regardless of hardware differences (e.g., O(1), O(log n), O(n), O(n log n), O(n²)).",
      },
      {
        q: "How does a hash map work internally?",
        a: "A hash map converts a key into an array index using a hash function and stores key-value pairs in buckets. To handle collisions (when two keys produce the same hash index), it typically uses separate chaining (linked lists or balanced binary trees at each index) or open addressing (linear/quadratic probing).",
      },
      {
        q: "What is a binary search tree and its time complexity?",
        a: "A Binary Search Tree (BST) is a hierarchical node-based data structure where each node has at most two children, and the left child's value is less than the parent's, while the right child's value is greater. On average, search, insertion, and deletion take O(log n) time, but can degrade to O(n) in a skewed (unbalanced) tree.",
      },
      {
        q: "Explain the difference between BFS and DFS.",
        a: "BFS (Breadth-First Search) explores a graph or tree level by level using a Queue (FIFO), which is ideal for finding the shortest path in unweighted graphs. DFS (Depth-First Search) traverses as deep as possible along each branch before backtracking using a Stack (LIFO) or recursion, making it well-suited for topological sorting, cycle detection, and maze puzzles.",
      },
    ],
  },
  {
    title: "System Design",
    questions: [
      {
        q: "How would you design a URL shortener like bit.ly?",
        a: "A URL shortener maps a long URL to a unique short hash (e.g., Base62 encoding of an auto-incrementing ID or counter). Key components include: an API gateway with rate limiting, a distributed ID generator, a relational or NoSQL database with unique indices on the short code, and a caching layer (Redis) to serve hot redirect requests with low latency.",
      },
      {
        q: "Explain the concept of load balancing.",
        a: "Load balancing distributes incoming network traffic across multiple backend servers to prevent any single server from becoming a bottleneck, ensuring high availability, fault tolerance, and responsiveness. Common algorithms include Round Robin, Least Connections, IP Hash, and Weighted Round Robin. It can operate at Layer 4 (Transport/TCP) or Layer 7 (Application/HTTP).",
      },
      {
        q: "What is the difference between SQL and NoSQL databases?",
        a: "SQL databases (e.g., PostgreSQL, MySQL) are relational, use structured schemas with tables, support ACID transactions, and scale vertically. NoSQL databases (e.g., MongoDB, DynamoDB, Cassandra) are non-relational (document, key-value, column-family, graph), schema-flexible, favor horizontal scaling, and are often optimized for high write throughput or partition tolerance (BASE model).",
      },
      {
        q: "How does a CDN work?",
        a: "A Content Delivery Network (CDN) is a geographically distributed network of proxy servers (Edge servers) that caches static and dynamic web content (images, videos, HTML/CSS/JS) close to the end user. When a user requests content, it is served from the nearest Point of Presence (PoP), minimizing latency, reducing origin server load, and mitigating DDoS attacks.",
      },
      {
        q: "What are microservices and when would you use them?",
        a: "Microservices architecture structures an application as a suite of small, independently deployable, loosely coupled services organized around business capabilities that communicate via lightweight protocols (REST/gRPC/message queues). You should use them when systems have large engineering teams, disparate scaling requirements across modules, or need polyglot technology stacks.",
      },
    ],
  },
  {
    title: "JavaScript / React",
    questions: [
      {
        q: "What is the difference between var, let, and const?",
        a: "`var` is function-scoped (or globally scoped), hoisted with an initial value of `undefined`, and can be re-declared. `let` and `const` are block-scoped, hoisted but remain in the 'Temporal Dead Zone' until declared, and cannot be re-declared. `let` allows re-assignment, whereas `const` requires initialization and prevents re-assignment of the variable identifier.",
      },
      {
        q: "Explain how the event loop works in JavaScript.",
        a: "JavaScript is single-threaded and executes code on a Call Stack. Asynchronous tasks (timers, fetch requests, DOM events) are handled by Web APIs / Node C++ APIs. When complete, their callbacks enter the Task Queue (macro-tasks) or Microtask Queue (Promises, queueMicrotask). The Event Loop constantly monitors the Call Stack and, once empty, drains the entire Microtask Queue before processing the next macrotask.",
      },
      {
        q: "What are React hooks and why were they introduced?",
        a: "React Hooks (introduced in React 16.8) are functions (such as `useState`, `useEffect`, `useMemo`) that allow functional components to manage state and lifecycle features without writing class components. They solve issues like complex class component hierarchies, wrapper hell (render props / HOCs), and disparate lifecycle methods by enabling reusable, collocated stateful logic.",
      },
      {
        q: "What is the difference between useEffect and useLayoutEffect?",
        a: "`useEffect` runs asynchronously after the browser has completed layout and paint, making it non-blocking and ideal for data fetching, subscriptions, and event handlers. `useLayoutEffect` runs synchronously immediately after React mutates the DOM but before the browser paints the screen, making it suitable for reading DOM measurements and preventing visual flickers.",
      },
      {
        q: "How does React reconciliation work?",
        a: "Reconciliation is the process by which React updates the DOM. When state changes, React generates a new Virtual DOM tree and compares it with the previous tree using its Diffing Algorithm (O(n) heuristic: elements of different types generate different trees, and lists use `key` props for identity). React then applies only the minimal batch of necessary mutations to the real DOM.",
      },
    ],
  },
  {
    title: "HR & Behavioural",
    questions: [
      {
        q: "Tell me about yourself.",
        a: "Structure using the Present-Past-Future formula: Start with your current role, primary technical skills, and a recent major achievement. Next, briefly mention your relevant background, educational foundation, or previous work that shaped your expertise. Finally, explain why you are excited about this specific opportunity and how your goals align with the team's mission.",
      },
      {
        q: "What is your greatest strength and weakness?",
        a: "For strength: choose a role-relevant quality (e.g., deep technical problem-solving or cross-team collaboration) and back it up with a tangible example. For weakness: choose a genuine, non-fatal area of improvement (e.g., occasionally taking on too much or over-optimizing early) and detail the proactive strategies or systems you are actively using to improve.",
      },
      {
        q: "Describe a challenging situation and how you handled it.",
        a: "Use the STAR method (Situation, Task, Action, Result): Set the context of a tough production incident or tight deadline, define your exact responsibility, explain the specific technical or interpersonal actions you took with composure, and quantify the positive end outcome (e.g., reduced downtime by 40% or shipped on schedule).",
      },
      {
        q: "Where do you see yourself in 5 years?",
        a: "Demonstrate ambition, commitment, and realistic growth. Express desire to master your domain, take on greater technical leadership (such as architecting scalable systems or mentoring junior engineers), and make measurable contributions to the company's long-term product roadmap.",
      },
      {
        q: "Why do you want to work at this company?",
        a: "Show that you did your homework: reference the company's specific products, tech challenges, engineering culture, or market vision. Connect these to your own passions and explain how your skill set allows you to make an immediate, impactful contribution to their current objectives.",
      },
    ],
  },
];

const QuestionPage = () => {
  const { user } = useUser();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [fetchingSaved, setFetchingSaved] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [openCategoryAnswer, setOpenCategoryAnswer] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const menuRef = useRef(null);

  const toggleCategoryAnswer = (key) => {
    setOpenCategoryAnswer((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fetch saved questions for current user
  const fetchUserQuestions = async () => {
    setFetchingSaved(true);
    try {
      const res = await getUserAskedQuestionsAction();
      setSavedQuestions(res?.savedQuestions || []);
    } catch (error) {
      console.error("Error fetching user asked questions:", error);
    } finally {
      setFetchingSaved(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserQuestions();
    }
  }, [user]);

  // Close ... menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate answer & save to DB via Server Action
  const handleGenerateAndSave = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await askAndSaveQuestionAction(question);

      if (res?.success) {
        setAnswer(res.answer);
        if (res.savedQuestion) {
          setSavedQuestions((prev) => [res.savedQuestion, ...prev]);
        }
        toast.success("Question and answer saved!");
      } else {
        toast.error(res?.error || "Failed to generate answer. Please try again.");
      }
    } catch (error) {
      console.error("Error generating/saving question:", error);
      toast.error("Failed to generate or save answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item, e) => {
    e?.stopPropagation();
    setQuestionToDelete(item);
    setDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  // Confirm delete question from DB via Server Action
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setDeletingId(questionToDelete.id);

    try {
      const res = await deleteUserAskedQuestionAction(questionToDelete.id);
      if (res?.success) {
        setSavedQuestions((prev) => prev.filter((item) => item.id !== questionToDelete.id));
        toast.success("Question deleted successfully!");
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
      } else {
        toast.error(res?.error || "Failed to delete question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCardExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="h-7 w-7 text-primary" />
          Questions & Custom Q&A
        </h1>
        <p className="text-gray-500 mt-1">
          Explore curated interview questions, ask custom questions, and review your saved Q&A history.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Ask Any Question */}
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-gray-800">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Ask Any Question
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Type any question below. AI will provide a model answer and automatically save it to your asked questions.
          </p>

          <Textarea
            placeholder="Ex. What is the difference between authentication and authorization?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full"
          />

          <div className="flex items-center gap-3 mt-3">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleGenerateAndSave}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                  Generating & Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Answer & Save
                </>
              )}
            </Button>

            {question && (
              <Button
                variant="ghost"
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {answer && (
            <div className="mt-4 p-4 border border-blue-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap bg-blue-50/50">
              <strong className="block mb-1 text-blue-900 font-semibold">
                Generated AI Model Answer:
              </strong>
              {answer}
            </div>
          )}
        </div>

        {/* Section 2: Saved / Asked Questions with (...) Options */}
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Your Saved Questions ({savedQuestions.length})
              </h2>
              <p className="text-xs text-gray-500">
                Questions you have asked and their saved AI answers.
              </p>
            </div>
            {fetchingSaved && (
              <LoaderCircle className="animate-spin h-4 w-4 text-gray-400" />
            )}
          </div>

          {savedQuestions.length === 0 && !fetchingSaved ? (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg bg-gray-50">
              <HelpCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-sm">No saved questions yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Ask a question using the box above to see it saved here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" ref={menuRef}>
              {savedQuestions.map((item) => {
                const isExpanded = expandedCards[item.id] !== false; // expanded by default
                const isMenuOpen = openMenuId === item.id;
                const isDeleting = deletingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-gray-50/40 hover:bg-gray-50 transition-all relative"
                  >
                    {/* Header: Question + Date + (...) Action button */}
                    <div className="flex justify-between items-start gap-3">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleCardExpand(item.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            Q
                          </span>
                          {item.createdAt && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.createdAt}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                          {item.question}
                        </h3>
                      </div>

                      {/* (...) Action Menu Button */}
                      <div className="relative">
                        <button
                          type="button"
                          aria-label="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : item.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95">
                            <button
                              type="button"
                              onClick={(e) => openDeleteDialog(item, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Question
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Answer Preview / Body */}
                    <div className="mt-2.5 pt-2.5 border-t border-gray-200/70">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          AI Answer
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCardExpand(item.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              Hide <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              View <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-md border border-gray-200 mt-1">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Category Question Bank */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Curated Category Question Bank
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Practice with standard interview questions across various domains. Click any question to reveal its model answer.
          </p>

          <div className="flex flex-col gap-3">
            {categories.map((category, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-lg font-semibold text-left hover:bg-gray-200 transition-all text-sm md:text-base">
                  <span>{category.title}</span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 flex flex-col gap-2">
                    {category.questions.map((item, i) => {
                      const key = `${index}-${i}`;
                      const isAnswerOpen = !!openCategoryAnswer[key];
                      return (
                        <div
                          key={i}
                          className="border rounded-lg bg-white overflow-hidden transition-all shadow-xs"
                        >
                          <div
                            className="p-3 text-sm text-gray-800 flex justify-between items-center gap-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleCategoryAnswer(key)}
                          >
                            <span className="font-medium">
                              {i + 1}. {item.q}
                            </span>
                            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 shrink-0">
                              {isAnswerOpen ? (
                                <>
                                  Hide Answer <ChevronUp className="h-3.5 w-3.5" />
                                </>
                              ) : (
                                <>
                                  View Answer <ChevronDown className="h-3.5 w-3.5" />
                                </>
                              )}
                            </span>
                          </div>
                          {isAnswerOpen && (
                            <div className="px-3.5 pb-3.5 pt-1 text-sm text-gray-600 bg-gray-50/70 border-t border-gray-100 whitespace-pre-wrap leading-relaxed">
                              <strong className="block mb-1 text-xs font-semibold text-gray-800 uppercase tracking-wide">
                                Model Answer:
                              </strong>
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Question?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete the question{" "}
              <strong className="text-gray-900 font-semibold">
                "{questionToDelete?.question}"
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={deletingId !== null}
              onClick={() => {
                setDeleteDialogOpen(false);
                setQuestionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deletingId !== null}
              className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
              onClick={handleConfirmDelete}
            >
              {deletingId !== null ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionPage;
