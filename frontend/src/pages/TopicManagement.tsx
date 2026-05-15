/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';

import {
  Plus,
  BookOpen,
  File,
  ChevronRight,
} from 'lucide-react';

import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import FileUpload from '../components/FileUpload';
import Tabs from '../components/Tabs';

import api from '../services/api';

const TopicManagement: React.FC = () => {
  // =====================================
  // STATES
  // =====================================

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [topicsList, setTopicsList] =
    useState<any[]>([]);

  const [chaptersList, setChaptersList] =
    useState<any[]>([]);

  const [subjects, setSubjects] =
    useState<any[]>([]);

  const [selectedTopic, setSelectedTopic] =
    useState<number | null>(null);

  const [showTopicModal, setShowTopicModal] =
    useState(false);

  const [showChapterModal, setShowChapterModal] =
    useState(false);

  const [showMaterialModal, setShowMaterialModal] =
    useState(false);

  // =====================================
  // FORMS
  // =====================================

  const [newTopic, setNewTopic] =
    useState({
      name: '',
      subject_id: 1,
    });

  const [newChapter, setNewChapter] =
    useState({
      name: '',
      order: 1,
    });

    const [selectedChapter, setSelectedChapter] =
      useState<number | null>(null);

    const [materialTitle, setMaterialTitle] =
      useState('');

    const [selectedFiles, setSelectedFiles] =
      useState<File[]>([]);

    const [uploading, setUploading] =
      useState(false);
  // =====================================
  // FETCH SUBJECTS
  // =====================================

  const fetchSubjects = async () => {
    try {
      const res =
        await api.get('/subjects');

      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================
  // FETCH TOPICS
  // =====================================

  const fetchTopics = async () => {
    try {
      setLoading(true);

      const res =
        await api.get('/topics');

      setTopicsList(res.data.data || []);
    } catch (err) {
      console.error(err);

      alert(
        'Failed to fetch topics'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FETCH CHAPTERS
  // =====================================

  const fetchChapters = async (
    topicId: number
  ) => {
    try {
      const res = await api.get(
        `/topics/${topicId}`
      );

      setChaptersList(
        res.data.data.chapters || []
      );
    } catch (err) {
      console.error(err);

      alert(
        'Failed to fetch chapters'
      );
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, []);

  // =====================================
  // FETCH CHAPTERS ON TOPIC CHANGE
  // =====================================

  useEffect(() => {
    if (selectedTopic !== null) {
      fetchChapters(selectedTopic);
    }
  }, [selectedTopic]);

  // =====================================
  // CREATE TOPIC
  // =====================================

  const handleCreateTopic =
    async () => {
      try {
        if (
          !newTopic.name.trim()
        ) {
          alert(
            'Topic name is required'
          );

          return;
        }

        await api.post('/topics', {
          name: newTopic.name,
          subject_id:
            newTopic.subject_id,
        });

        await fetchTopics();

        setNewTopic({
          name: '',
          subject_id: 1,
        });

        setShowTopicModal(false);

        alert(
          'Topic created successfully'
        );
      } catch (err) {
        console.error(err);

        alert(
          'Failed to create topic'
        );
      }
    };

  // =====================================
  // CREATE CHAPTER
  // =====================================

  const handleCreateChapter =
    async () => {
      try {
        if (
          !newChapter.name.trim()
        ) {
          alert(
            'Chapter name is required'
          );

          return;
        }

        // ============================
        // MUST SELECT TOPIC CARD
        // ============================

        if (
          selectedTopic === null
        ) {
          alert(
            'Please select a topic card first'
          );

          return;
        }

        // ============================
        // CREATE CHAPTER
        // ============================

        await api.post(
          `/topics/${selectedTopic}/chapters`,
          {
            name: newChapter.name,
            order: Number(
              newChapter.order
            ),
          }
        );

        // ============================
        // REFRESH DATA
        // ============================

        await fetchChapters(
          selectedTopic
        );

        await fetchTopics();

        // ============================
        // RESET FORM
        // ============================

        setNewChapter({
          name: '',
          order: 1,
        });

        setShowChapterModal(false);

        alert(
          'Chapter created successfully'
        );
      } catch (err) {
        console.error(err);

        alert(
          'Failed to create chapter'
        );
      }
    };

    const handleUploadMaterial =
  async () => {
    try {
      if (!materialTitle.trim()) {
        alert(
          'Material title is required'
        );

        return;
      }

      if (
        selectedTopic === null
      ) {
        alert(
          'Please select a topic first'
        );

        return;
      }

      if (
        selectedFiles.length === 0
      ) {
        alert(
          'Please select a file'
        );

        return;
      }

      // ============================
      // MUST HAVE CHAPTER
      // ============================

      if (
        chaptersList.length === 0
      ) {
        alert(
          'Please create a chapter first'
        );

        return;
      }

      setUploading(true);

      // ============================
      // USE FIRST CHAPTER FOR NOW
      // ============================

      const chapterId =
        chaptersList[0].id;

      const formData =
        new FormData();

      formData.append(
        'title',
        materialTitle
      );

      formData.append(
        'chapter_id',
        String(chapterId)
      );

      formData.append(
        'file',
        selectedFiles[0]
      );

      await api.post(
        '/materials',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      alert(
        'Material uploaded successfully'
      );

      // reset
      setMaterialTitle('');

      setSelectedFiles([]);

      setShowMaterialModal(false);
    } catch (err) {
      console.error(err);

      alert(
        'Failed to upload material'
      );
    } finally {
      setUploading(false);
    }
  };
  // =====================================
  // FILTER TOPICS
  // =====================================

  const filteredTopics =
    topicsList.filter((topic) =>
      topic.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // =====================================
  // TOPICS TAB
  // =====================================

  const topicContent = (
    <>
       <div className="topic__header">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search topics..."
        />

        <Button
          icon={<Plus size={16} />}
          onClick={() =>
            setShowTopicModal(true)
          }
        >
          Create Topic
        </Button>
      </div>

      <div className="topic__list">
        {loading ? (
          <p>Loading topics...</p>
        ) : filteredTopics.length ===
          0 ? (
          <p>No topics found.</p>
        ) : (
          filteredTopics.map(
            (topic) => (
              <GlassCard
                key={topic.id}
                hover
                className={`topic__card ${
                  selectedTopic ===
                  topic.id
                    ? 'topic__card--active'
                    : ''
                }`}
                onClick={() => {
                  setSelectedTopic(
                    topic.id
                  );
                }}
              >
                {/* HEADER */}
                <div className="topic__card-header">
                  <div className="topic__card-icon">
                    <BookOpen
                      size={20}
                    />
                  </div>

                  <Badge
                    variant={
                      topic.status ===
                      'completed'
                        ? 'success'
                        : topic.status ===
                          'active'
                        ? 'info'
                        : 'default'
                    }
                  >
                    {topic.status}
                  </Badge>
                </div>

                {/* NAME */}
                <h4 className="topic__card-name">
                  {topic.name}
                </h4>

                {/* SUBJECT */}
                <p className="topic__card-subject">
                  {
                    topic.subject_name
                  }
                </p>

                {/* META */}
                <div className="topic__card-meta">
                  <span>
                    {topic.chapters ||
                      0}{' '}
                    Chapters
                  </span>
                </div>

                {/* PROGRESS */}
                <ProgressBar
                  value={
                    topic.progress ||
                    0
                  }
                  size="sm"
                />

                {/* FOOTER */}
                <div className="topic__card-footer">
                  <span className="topic__card-progress">
                    {topic.progress ||
                      0}
                    % Complete
                  </span>

                  <ChevronRight
                    size={16}
                  />
                </div>
              </GlassCard>
            )
          )
        )}
      </div>
    </>
  );

  // =====================================
  // CHAPTER TAB
  // =====================================

  const chapterContent = (
    <div className="topic__chapters">
      <div className="topic__chapters-header">
        <h3>
          Chapters{' '}
          {selectedTopic
            ? `- ${
                topicsList.find(
                  (t) =>
                    t.id ===
                    selectedTopic
                )?.name || ''
              }`
            : ''}
        </h3>

        <Button
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => {
            if (
              selectedTopic ===
              null
            ) {
              alert(
                'Please select a topic card first'
              );

              return;
            }

            setShowChapterModal(
              true
            );
          }}
        >
          Add Chapter
        </Button>
      </div>

      <div className="topic__chapter-list">
        {selectedTopic ===
        null ? (
          <p>
            Select a topic to
            view chapters.
          </p>
        ) : chaptersList.length ===
          0 ? (
          <p>
            No chapters found.
          </p>
        ) : (
          chaptersList.map(
            (chapter) => (
              <div
                key={chapter.id}
                className={`topic__chapter-item ${
                  selectedChapter === chapter.id
                    ? 'topic__chapter-item--active'
                    : ''
                }`}
                onClick={() =>
                  setSelectedChapter(chapter.id)
                }
              >
                <div className="topic__chapter-order">
                  {
                    chapter.order
                  }
                </div>

                <div className="topic__chapter-info">
                  <h4>
                    {
                      chapter.name
                    }
                  </h4>

                  <div className="topic__chapter-meta">
                    <Badge
                      variant={
                        chapter.status ===
                        'completed'
                          ? 'success'
                          : chapter.status ===
                            'active'
                          ? 'info'
                          : 'default'
                      }
                    >
                      {
                        chapter.status
                      }
                    </Badge>
                  </div>
                </div>

                <ProgressBar
                  value={
                    chapter.progress ||
                    0
                  }
                  size="sm"
                  showValue={
                    false
                  }
                />

                <span className="topic__chapter-pct">
                  {chapter.progress ||
                    0}
                  %
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );

  // =====================================
  // MATERIAL TAB
  // =====================================

  const materialContent = (
    <div className="topic__materials">
      <div className="topic__materials-header">
        <h3>
          Study Materials
          {selectedTopic && (
            <span>
              {' '}
              - {
                topicsList.find(
                  (t) => t.id === selectedTopic
                )?.name
              }
            </span>
          )}
        </h3>

        <Button
          size="sm"
          icon={<Plus size={16} />}
          onClick={() =>
            setShowMaterialModal(
              true
            )
          }
        >
          Upload Material
        </Button>
      </div>

      <div className="topic__material-list">
        <p
          style={{
            padding: '2rem',
            textAlign:
              'center',
          }}
        >
          Material module
          coming soon
        </p>
      </div>
    </div>
  );

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="topic">

      {/* TABS */}
      <Tabs
        tabs={[
          {
            id: 'topics',
            label: 'Topics',
            icon: (
              <BookOpen
                size={16}
              />
            ),
            content:
              topicContent,
          },
          {
            id: 'chapters',
            label: 'Chapters',
            icon: (
              <ChevronRight
                size={16}
              />
            ),
            content:
              chapterContent,
          },
          {
            id: 'materials',
            label:
              'Materials',
            icon: (
              <File
                size={16}
              />
            ),
            content:
              materialContent,
          },
        ]}
      />

      {/* CREATE TOPIC MODAL */}
      <Modal
        isOpen={
          showTopicModal
        }
        onClose={() =>
          setShowTopicModal(
            false
          )
        }
        title="Create Topic"
      >
        <div className="topic__modal-form">
          <InputField
            label="Topic Name"
            value={
              newTopic.name
            }
            onChange={(
              e
            ) =>
              setNewTopic({
                ...newTopic,
                name:
                  e.target
                    .value,
              })
            }
          />

          <SelectField
            label="Subject"
            value={String(
              newTopic.subject_id
            )}
            onChange={(
              e
            ) =>
              setNewTopic({
                ...newTopic,
                subject_id:
                  Number(
                    e
                      .target
                      .value
                  ),
              })
            }
            options={subjects.map(
              (
                subject
              ) => ({
                value:
                  String(
                    subject.id
                  ),
                label:
                  subject.name,
              })
            )}
          />

          <div className="topic__modal-actions">
            <Button
              variant="outline"
              onClick={() =>
                setShowTopicModal(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleCreateTopic
              }
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* CREATE CHAPTER MODAL */}
      <Modal
        isOpen={
          showChapterModal
        }
        onClose={() =>
          setShowChapterModal(
            false
          )
        }
        title="Create Chapter"
      >
        <div className="topic__modal-form">
          <InputField
            label="Chapter Name"
            value={
              newChapter.name
            }
            onChange={(
              e
            ) =>
              setNewChapter({
                ...newChapter,
                name:
                  e.target
                    .value,
              })
            }
          />

          <InputField
            label="Order"
            type="number"
            value={
              newChapter.order
            }
            onChange={(
              e
            ) =>
              setNewChapter({
                ...newChapter,
                order:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <div className="topic__modal-actions">
            <Button
              variant="outline"
              onClick={() =>
                setShowChapterModal(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleCreateChapter
              }
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* MATERIAL MODAL */}
      <Modal
        isOpen={showMaterialModal}
        onClose={() =>
          setShowMaterialModal(false)
        }
        title="Upload Material"
      >
        <div className="topic__modal-form">
          <InputField
            label="Material Name"
            placeholder="Enter material name"
            value={materialTitle}
            onChange={(e) =>
              setMaterialTitle(
                e.target.value
              )
            }
          />

          <FileUpload
            onFilesSelected={(files) =>
              setSelectedFiles(files)
            }
          />

          <div className="topic__modal-actions">
            <Button
              variant="outline"
              onClick={() =>
                setShowMaterialModal(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleUploadMaterial
              }
              disabled={uploading}
            >
              {uploading
                ? 'Uploading...'
                : 'Upload'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TopicManagement;