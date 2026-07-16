"""Add doctor verification metadata columns

Revision ID: a1b2c3d4e5f6
Revises: 92e8c9a4b738
Create Date: 2026-07-13 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '92e8c9a4b738'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('doctor_profiles', 'verification_status', existing_type=sa.String(length=50), server_default='not_submitted')
    op.add_column('doctor_profiles', sa.Column('verification_date', sa.DateTime(), nullable=True))
    op.add_column('doctor_profiles', sa.Column('rejection_reason', sa.String(length=500), nullable=True))
    op.execute("UPDATE doctor_profiles SET verification_status = COALESCE(verification_status, 'not_submitted') WHERE verification_status IS NULL")
    op.execute("UPDATE doctor_profiles SET verified = CASE WHEN COALESCE(verification_status, 'not_submitted') = 'verified' THEN 1 ELSE 0 END")


def downgrade() -> None:
    op.drop_column('doctor_profiles', 'rejection_reason')
    op.drop_column('doctor_profiles', 'verification_date')
    op.alter_column('doctor_profiles', 'verification_status', existing_type=sa.String(length=50), server_default=None)
